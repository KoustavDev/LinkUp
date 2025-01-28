"use client";
import { useGetInfinitePosts, useSearchPost } from "@/backend/queryAndMutation";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebouncer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Page = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 1000);
  const {data: searchResult, isFetching} = useSearchPost(debouncedSearch);
  const { data: posts, fetchNextPage, hasNextPage } = useGetInfinitePosts();
  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue, fetchNextPage]);
  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  const showSearchResult = searchValue !== "";
  const showPosts =
    !showSearchResult &&
    posts.pages.every((item) => item?.documents.length === 0);
  // console.log(showPosts);
  return (
    <div className="explore-container mb-16 lg:mb-0">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <Image
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {showSearchResult ? (
          searchResult ? (
            <SearchResults
              isfetching={isFetching}
              searchResult={searchResult?.documents}
            />
          ) : (
            <p className="text-light-4 mt-10 text-center w-full">
              Post not found
            </p>
          )
        ) : showPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map(
            (item, index) =>
              item && (
                <GridPostList key={`Page-${index}`} posts={item.documents} />
              )
          )
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Page;
