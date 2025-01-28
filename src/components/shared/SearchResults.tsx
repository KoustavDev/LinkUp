import React from 'react'
import Loader from './Loader';
import { Models } from 'appwrite';
import GridPostList from './GridPostList';

const SearchResults = ({
  isfetching,
  searchResult,
}: {
  isfetching: boolean;
  searchResult?: Models.Document[];
}) => {
  if (isfetching) {
    return <Loader />;
  } else if (searchResult && searchResult.length > 0){
    return <GridPostList posts={searchResult} />
  } else {
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>;
  }
};

export default SearchResults