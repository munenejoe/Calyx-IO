# backend/database.py
import os
from typing import Any, Dict, List, Optional, cast

import numpy as np
from supabase import Client, create_client

JSONDict = Dict[str, Any]


class SupabaseClient:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")

        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")

        self.client: Client = create_client(url, key)
        self._connected = True
        

    def is_connected(self) -> bool:
        return self._connected
    
    def _species_table(self):
        return self.client.table("species")

    async def rpc(self, function_name: str, params: dict) -> List[JSONDict]:
        response = self.client.rpc(function_name, params).execute()

        data = response.data
        if not isinstance(data, list):
            return []

        return cast(List[JSONDict], data)

    async def search_by_traits(self, traits: Dict[str, Any]) -> List[JSONDict]:
        return await self.rpc("search_by_traits", {"input_traits": traits})

    async def search_by_embedding(self, embedding: List[float]) -> List[JSONDict]:
        try:
            result = self.client.rpc(
                "match_species",
                {"query_embedding": embedding, "match_threshold": 0.5, "match_count": 5},
            ).execute()

            rows = cast(List[JSONDict], result.data or [])
            formatted: List[JSONDict] = []

            for r in rows:
                formatted.append(
                    {
                        "id": r.get("species_id"),
                        "scientific_name": r.get("scientific_name"),
                        "common_names": r.get("common_names"),
                        "confidence": r.get("similarity"),
                    }
                )

            return formatted
        except Exception as e:
            print(f"Error in vector search: {e}")
            return []

    async def refine_with_embedding(self, candidates: List[JSONDict], embedding: List[float]) -> List[JSONDict]:
        try:
            candidate_ids = [c["id"] for c in candidates if "id" in c]
            if not candidate_ids:
                return []

            result = (
                self.client.table("species")
                .select("id, scientific_name, common_names, primary_image_url, embedding")
                .in_("id", candidate_ids)
                .execute()
            )

            rows = cast(List[JSONDict], result.data or [])
            query_vec = np.array(embedding, dtype=float)

            scored: List[JSONDict] = []
            for species in rows:
                emb = species.get("embedding")
                if not emb:
                    continue

                species_vec = np.array(emb, dtype=float)
                denom = float(np.linalg.norm(query_vec) * np.linalg.norm(species_vec))
                if denom == 0:
                    continue

                similarity = float(np.dot(query_vec, species_vec) / denom)
                species["confidence"] = similarity
                scored.append(species)

            scored.sort(key=lambda x: float(x.get("confidence", 0.0)), reverse=True)
            return scored
        except Exception as e:
            print(f"Error refining with embedding: {e}")
            return candidates

    async def text_search(self, query: str, limit: int = 20) -> List[JSONDict]:
        try:
            result = (
                self.client.table("species")
                .select("id, scientific_name, common_names, primary_image_url, family")
                .or_(f"scientific_name.ilike.%{query}%,common_names.cs.{{{query}}}")
                .limit(limit)
                .execute()
            )
            return cast(List[JSONDict], result.data or [])
        except Exception as e:
            print(f"Error in text search: {e}")
            return []

    async def get_species_by_id(self, species_id: str) -> Optional[JSONDict]:
        try:
            print("\n========== SPECIES REQUEST ==========")
            print("Species ID:", species_id)

            # Main species record
            result = (
                self.client.table("species")
                .select(
                    """
                    id,
                    scientific_name,
                    species,
                    genus,
                    family,
                    order_name,

                    common_names,
                    description,

                    primary_image_url,
                    thumbnail_url,

                    color_primary,
                    color_secondary,
                    petal_shape,
                    flower_size,
                    bloom_openness,
                    petal_count,
                    petal_shape_outer,
                    petal_shape_inner,
                    petal_overlap,
                    petal_margin,
                    centre_morphology,
                    petal_flow,
                    stamen_visible,
                    anther_visible,
                    stigma_visible,
                    color_text,
                    color_finish,

                    created_at,
                    updated_at
                    """
                )
                .eq("id", species_id)
                .single()
                .execute()
            )

            data = cast(Optional[JSONDict], result.data)

            print("Species found:", data is not None)

            if not data:
                return None

            # ---------------------------------------------------
            # Gallery images
            # ---------------------------------------------------

            gallery_result = (
                self.client.table("species_images")
                .select(
                    """
                    id,
                    species_id,
                    image_order,
                    image_url,
                    thumbnail_url,
                    width,
                    height,
                    source,
                    license,
                    attribution
                    """
                )
                .eq("species_id", species_id)
                .order("image_order")
                .execute()
            )

            gallery_images = cast(List[JSONDict], gallery_result.data or [])

            print(f"Gallery images: {len(gallery_images)}")

            for img in gallery_images:
                print(
                    f"[{img.get('image_order')}] "
                    f"{img.get('species_id')} "
                    f"{img.get('image_url')}"
                )

            data["gallery_images"] = gallery_images
            
            data["taxonomy"] = {
                "order": data.get("order_name"),
                "family": data.get("family"),
                "genus": data.get("genus"),
                "species": data.get("species"),
                "scientific_name": data.get("scientific_name"),
            }
            
            data["traits"] = {
                "color_primary": data.get("color_primary"),
                "color_secondary": data.get("color_secondary"),
                "flower_size": data.get("flower_size"),
                "petal_count": data.get("petal_count"),
                "petal_shape": data.get("petal_shape"),
                "petal_shape_outer": data.get("petal_shape_outer"),
                "petal_shape_inner": data.get("petal_shape_inner"),
                "petal_overlap": data.get("petal_overlap"),
                "petal_margin": data.get("petal_margin"),
                "petal_flow": data.get("petal_flow"),
                "centre_morphology": data.get("centre_morphology"),
                "stamen_visible": data.get("stamen_visible"),
                "anther_visible": data.get("anther_visible"),
                "stigma_visible": data.get("stigma_visible"),
                "bloom_openness": data.get("bloom_openness"),
                "color_finish": data.get("color_finish"),
                "color_text": data.get("color_text"),
            }

            print("=====================================\n")

            return data

        except Exception as e:
            print("ERROR IN get_species_by_id")
            print(repr(e))
            return None

    async def get_cached_identification(self, image_hash: str) -> Optional[JSONDict]:
        try:
            result = (
                self.client.table("identification_cache")
                .select("*, species(*)")
                .eq("image_hash", image_hash)
                .gt("expires_at", "now()")
                .single()
                .execute()
            )

            data = cast(Optional[JSONDict], result.data)
            if not data:
                return None

            species = cast(JSONDict, data.get("species") or {})

            return {
                "id": data.get("id"),
                "species_id": data.get("species_id"),
                "scientific_name": species.get("scientific_name"),
                "common_names": species.get("common_names"),
                "confidence": data.get("confidence"),
                "primary_image_url": species.get("primary_image_url"),
                "traits_extracted": data.get("traits_extracted"),
            }
        except Exception:
            return None

    async def cache_identification(
        self,
        image_hash: str,
        species_id: str,
        confidence: float,
        traits: Dict[str, Any],
        method: str,
    ) -> None:
        try:
            self.client.table("identification_cache").insert(
                {
                    "image_hash": image_hash,
                    "species_id": species_id,
                    "confidence": confidence,
                    "traits_extracted": traits,
                    "method": method,
                }
            ).execute()
        except Exception as e:
            print(f"Error caching identification: {e}")

    async def increment_cache_hit(self, cache_id: str) -> None:
        try:
            result = (
                self.client.table("identification_cache")
                .select("hit_count")
                .eq("id", cache_id)
                .single()
                .execute()
            )

            data = cast(Optional[JSONDict], result.data)
            if not data:
                return

            current = int(data.get("hit_count") or 0)
            self.client.table("identification_cache").update({"hit_count": current + 1}).eq("id", cache_id).execute()
        except Exception as e:
            print(f"Error incrementing cache hit: {e}")

    async def save_feedback(
        self,
        identification_id: str,
        is_correct: bool,
        correct_species_id: Optional[str],
        notes: Optional[str],
    ) -> None:
        try:
            self.client.table("identification_feedback").insert(
                {
                    "cache_id": identification_id,
                    "user_confirmed": is_correct,
                    "correct_species_id": correct_species_id,
                    "notes": notes,
                }
            ).execute()
        except Exception as e:
            print(f"Error saving feedback: {e}")

    async def get_stats(self) -> JSONDict:
        try:
            total_identifications = self.client.table("identification_cache").select("id", count=cast(Any, "exact")).execute()
            cache_hits = self.client.table("identification_cache").select("hit_count").execute()
            rows = cast(List[JSONDict], cache_hits.data or [])

            total_hits = sum(int(row.get("hit_count") or 0) for row in rows)
            total_count = int(total_identifications.count or 0)

            return {
                "total_identifications": total_count,
                "total_cache_hits": total_hits,
                "cache_hit_rate": total_hits / max(total_count, 1),
            }
        except Exception as e:
            print(f"Error getting stats: {e}")
            return {"total_identifications": 0, "total_cache_hits": 0, "cache_hit_rate": 0.0}

    # ------------------------
    # Catalogue helpers
    # ------------------------

    async def get_catalogue(
        self,
        name_filter: Optional[str] = None,
        color_filter: Optional[List[str]] = None,
        country_filter: Optional[str] = None,
        sort_by: str = "name",
        page: int = 1,
        limit: int = 20,
    ) -> JSONDict:
        try:
            if limit > 100:
                limit = 100
            if page < 1:
                page = 1

            offset = (page - 1) * limit

            query = self.client.table("species").select(
                "id, scientific_name, common_names, family, traits, "
                "primary_image_url, thumbnail_url, bloom_season, "
                "native_region, search_count, created_at",
                count=cast(Any, "exact"),
            )

            if name_filter:
                query = query.or_(
                    f"scientific_name.ilike.%{name_filter}%,"
                    f"common_names.cs.{{{name_filter}}}"
                )

            if country_filter:
                query = query.contains("native_region", [country_filter])

            multi_color = bool(color_filter and len(color_filter) > 1)
            if color_filter and len(color_filter) == 1:
                query = query.contains("traits", {"color_primary": [color_filter[0]]})

            if sort_by == "popularity":
                query = query.order("search_count", desc=True)
            elif sort_by == "recent":
                query = query.order("created_at", desc=True)
            else:
                query = query.order("scientific_name", desc=False)

            result = query.range(offset, offset + limit - 1).execute()
            items = cast(List[JSONDict], result.data or [])

            if multi_color:
                wanted = set(color_filter or [])
                filtered: List[JSONDict] = []
                for item in items:
                    traits = cast(JSONDict, item.get("traits") or {})
                    item_colors = traits.get("color_primary") or []
                    if isinstance(item_colors, str):
                        item_colors = [item_colors]
                    if isinstance(item_colors, list) and any(str(c) in wanted for c in item_colors):
                        filtered.append(item)
                items = filtered

            total_count = int(result.count or len(items))
            total_pages = (total_count + limit - 1) // limit

            return {
                "items": items,
                "total": total_count,
                "page": page,
                "pages": total_pages,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1,
                "limit": limit,
            }
        except Exception as e:
            print(f"Error getting catalogue: {e}")
            return {"items": [], "total": 0, "page": page, "pages": 0, "has_next": False, "has_prev": False, "limit": limit}

    async def get_available_filters(self) -> JSONDict:
        try:
            result = self.client.table("species").select("traits, native_region").execute()
            rows = cast(List[JSONDict], result.data or [])

            colors_set: set[str] = set()
            countries_set: set[str] = set()

            for sp in rows:
                traits = cast(JSONDict, sp.get("traits") or {})
                color_primary = traits.get("color_primary") or []
                if isinstance(color_primary, str):
                    color_primary = [color_primary]
                if isinstance(color_primary, list):
                    colors_set.update(str(c) for c in color_primary)

                native_region = sp.get("native_region") or []
                if isinstance(native_region, str):
                    native_region = [native_region]
                if isinstance(native_region, list):
                    countries_set.update(str(c) for c in native_region)

            colors_list: List[JSONDict] = []
            for c in sorted(colors_set):
                colors_list.append({"value": c, "label": c.capitalize(), "count": await self.count_by_color(c)})

            countries_list: List[JSONDict] = []
            for c in sorted(countries_set):
                countries_list.append({"value": c, "label": c, "count": await self.count_by_country(c)})

            return {"colors": colors_list, "countries": countries_list}
        except Exception as e:
            print(f"Error getting filters: {e}")
            return {"colors": [], "countries": []}

    async def count_by_color(self, color: str) -> int:
        try:
            result = (
                self.client.table("species")
                .select("id", count=cast(Any, "exact"))
                .contains("traits", {"color_primary": [color]})
                .execute()
            )
            return int(result.count or 0)
        except Exception:
            return 0

    async def count_by_country(self, country: str) -> int:
        try:
            result = (
                self.client.table("species")
                .select("id", count=cast(Any, "exact"))
                .contains("native_region", [country])
                .execute()
            )
            return int(result.count or 0)
        except Exception:
            return 0

    async def get_popular_flowers(self, limit: int = 10) -> List[JSONDict]:
        try:
            if limit > 50:
                limit = 50
            result = (
                self.client.table("species")
                .select("id, scientific_name, common_names, primary_image_url, thumbnail_url, search_count")
                .order("search_count", desc=True)
                .limit(limit)
                .execute()
            )
            return cast(List[JSONDict], result.data or [])
        except Exception as e:
            print(f"Error getting popular flowers: {e}")
            return []

    async def increment_search_count(self, species_id: str) -> None:
        try:
            result = self.client.table("species").select("search_count").eq("id", species_id).single().execute()
            data = cast(Optional[JSONDict], result.data)
            if not data:
                return

            current = int(data.get("search_count") or 0)
            self.client.table("species").update({"search_count": current + 1}).eq("id", species_id).execute()
        except Exception as e:
            print(f"Error incrementing search count: {e}")

