import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "./table.css";

const Table = ({ rows, columns, rowLink, setChecked, isUser }) => {
    const nav = useNavigate();
    const [formattedRows, setFormattedRow] = useState([]);
    useEffect(() => {
        setFormattedRow(
            rows.map((row) => {
                return {
                    ...row,
                    createdAt: row.createdAt
                        ? format(row.createdAt, "dd MMM yyyy, h:mm a")
                        : "",
                    startDate: row.startDate
                        ? format(row.startDate, "dd MMM yyyy, h:mm a")
                        : "",
                    endDate: row.endDate
                        ? format(row.endDate, "dd MMM yyyy, h:mm a")
                        : "",
                    product_isAvailable: row.product_isAvailable
                        ? "Còn hàng"
                        : "Hết hàng",
                };
            })
        );
        if (typeof setChecked !== "undefined") {
            document
                .querySelectorAll("input[type='checkbox']")
                .forEach((ckb) => (ckb.checked = false));
            setChecked([]);
        }
    }, [rows]);

    const handleCheck = (e) => {
        e.stopPropagation();
        setChecked(
            Array.from(
                document.querySelectorAll("input[name='ckb-data']:checked")
            ).map((checkbox) => checkbox.value)
        );
    };

    const handleCheckAll = (e) => {
        const checked = e.target.checked;
        if (!checked) {
            document
                .querySelectorAll("input[name='ckb-data']")
                .forEach((ckb) => (ckb.checked = false));
            setChecked([]);
        } else {
            document
                .querySelectorAll("input[name='ckb-data']")
                .forEach((ckb) => (ckb.checked = true));
            setChecked(Array.from(formattedRows.map((row) => row._id)));
        }
    };

    return (
        <table className='card-table'>
            <thead>
                <tr>
                    {typeof setChecked !== "undefined" ? (
                        <th className='col-checkbox'>
                            <input
                                type='checkbox'
                                onClick={(e) => handleCheckAll(e)}
                            />
                        </th>
                    ) : (
                        ""
                    )}
                    {columns.map((col) => (
                        <th key={col.key}>{col.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {formattedRows.length > 0 ? (
                    formattedRows.map((row, index) => (
                        <tr
                            key={index}
                            className='table-row'
                            onClick={
                                rowLink
                                    ? () =>
                                          nav(
                                              `${rowLink}/${isUser ? row.email : row._id}`
                                          )
                                    : null
                            }
                            style={{ cursor: "pointer" }}
                        >
                            {typeof setChecked !== "undefined" ? (
                                <td className='col-checkbox'>
                                    <input
                                        type='checkbox'
                                        name='ckb-data'
                                        value={row._id}
                                        onClick={(e) => handleCheck(e)}
                                    />
                                </td>
                            ) : (
                                ""
                            )}
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {(col.key.includes("price") ||
                                        col.key.includes("amount") ||
                                        col.key.includes("Amount")) &&
                                    col.key !== "discountAmount"
                                        ? new Intl.NumberFormat("vi-VN", {
                                              style: "currency",
                                              currency: "VND",
                                          }).format(Number(row[col.key]))
                                        : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan='2'>Không tìm thấy</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default memo(Table);