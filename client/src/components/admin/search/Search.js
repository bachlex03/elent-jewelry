import React, { useState, useEffect } from "react";
import "./search.css";

const Search = ({ data, standards, setValidData }) => {
    let [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        search(e.target.value);
    };

    useEffect(() => {
        search(searchQuery);
    }, [data]);

    const search = (query) => {
        try {
            let searchDatas = [];
            if (query === "") {
                searchDatas = data;
            } else {
                searchDatas = data.filter((d) => {
                    return standards.some((standard) => {
                        return (d[standard] + "")
                            .toLowerCase()
                            .includes(query.toLowerCase());
                    });
                });
            }
            setValidData(searchDatas);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='card-search'>
            <input
                type='text'
                className='search'
                placeholder='Tìm kiếm'
                value={searchQuery}
                onChange={handleSearch}
            />
        </div>
    );
};

export default Search;