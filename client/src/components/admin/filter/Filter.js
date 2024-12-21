import React, { useState, useEffect } from "react";
import Search from "../../../components/admin/search/Search";
import Sort from "../../../components/admin/sort/Sort";
import "./filter.css";

const Filter = ({
    filters,
    data,
    validData,
    setValidData,
    standardSearch,
    standardSort,
}) => {
    const [formattedFilters, setformattedFilters] = useState(
        filters.map((f) => {
            return {
                name: f.name,
                type: f.type,
                isOpen: false,
                standards: f.standards,
                selected: f.name,
            };
        })
    );

    const [filterdData, setFilterdData] = useState([]);
    useEffect(() => {
        setformattedFilters(
            filters.map((f) => {
                return {
                    name: f.name,
                    type: f.type,
                    isOpen: false,
                    standards: f.standards, // Đảm bảo lấy tiêu chuẩn mới nhất từ filters
                    selected: f.name,
                };
            })
        );
    }, [filters]); // Chạy lại khi filters thay đổi

    // Tạo lại mỗi khi dữ liệu chính thay đổi (data fetch từ API)
    useEffect(() => {
        formattedFilters.forEach((f) => {
            handleFilter(f.type, f.selected);
        });
    }, [data]);

    // Hàm wrap bên ngoài setValidData để đóng các dropdown
    const wrappedSetValidData = (data) => {
        setValidData(data);
        setformattedFilters(
            formattedFilters.map((f) => ({ ...f, isOpen: false }))
        );
    };

    const handleFilter = (filterType, standard) => {
        const tempFilter = formattedFilters.map((f) => {
            return f.type === filterType
                ? { ...f, isOpen: false, selected: standard }
                : { ...f, isOpen: false };
        });
        setformattedFilters(tempFilter);
        setFilterdData(
            data.filter((d) =>
                tempFilter.every(
                    (f) =>
                        f.selected === f.name ||
                        f.selected === "Tất cả" ||
                        d[f.type] === f.selected
                )
            )
        );
    };

    return (
        <>
            <Search
                data={filterdData}
                standards={standardSearch}
                setValidData={wrappedSetValidData}
            />
            <div className='card-filters'>
                {formattedFilters.map((f, index) => (
                    <div className='dropdown' key={index}>
                        <div
                            className={`dropdown-selected ${
                                f.isOpen ? "active" : ""
                            }`}
                            onClick={() => {
                                setformattedFilters(
                                    formattedFilters.map((item) => {
                                        return item.type === f.type
                                            ? { ...item, isOpen: !item.isOpen }
                                            : { ...item, isOpen: false };
                                    })
                                );
                            }}
                        >
                            {f.selected}
                        </div>
                        {f.isOpen ? (
                            <div className='dropdown-options'>
                                {f.standards.map((standard, index) => (
                                    <div
                                        key={index}
                                        className={
                                            standard === f.selected
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            handleFilter(f.type, standard)
                                        }
                                    >
                                        {standard}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ))}

                <Sort
                    standards={standardSort}
                    data={validData}
                    filters={formattedFilters}
                    setFilters={setformattedFilters}
                    setValidData={setValidData}
                />
            </div>
        </>
    );
};

export default Filter;
