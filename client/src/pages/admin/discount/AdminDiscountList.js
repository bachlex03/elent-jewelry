import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Pagination from "../../../components/admin/pagination/Pagination";
import Table from "../../../components/admin/table/Table";
import Filter from "../../../components/admin/filter/Filter";
import Modal from "../../../components/admin/modal/Modal";
import config from "../../../config";

const AdminDiscountList = () => {
    const [data, setData] = useState([]);
    const [validData, setValidData] = useState([]);
    const [pageData, setPageData] = useState([]);
    const [checkedRow, setCheckedRow] = useState([]);
    let [modal, setModal] = useState(false);
    const [filters, setFilters] = useState([]);
    const [initialValues, setInitialValues] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(
                `${config.API_URL}/admin/getAllDiscounts`
            );
            setData(res.data.discounts);
            setValidData(res.data.discounts);
            setPageData(res.data.discounts.slice(0, config.LIMIT));
            setFilters([
                {
                    name: "Loại giảm giá",
                    type: "discountType",
                    standards: ["Tất cả", "Phần trăm", "VNĐ"],
                },
            ]);
            setInitialValues({
                name: { label: "Tên", type: "text", value: "" },
                condition: { label: "Điều kiện", type: "number", value: "" },
                startDate: { label: "Ngày bắt đầu", type: "date", value: "" },
                endDate: {
                    label: "Ngày kết thúc",
                    type: "date",
                    value: "",
                },
                discountAmount: {
                    label: "Giảm giá",
                    type: "number",
                    value: "",
                },
                discountType: {
                    label: "Mật khẩu",
                    type: "select",
                    value: "percent",
                    options: ["Phần trăm", "VNĐ"],
                    options_value: ["percent", "fixed"],
                },
            });
        } catch (error) {
            console.error("Error fetching discounts:", error);
        }
    }, []);
    const standardSearch = ["name", "condition"];
    const standardSort = [
        { name: "Điều kiện", type: "condition" },
        { name: "Ngày bắt đầu", type: "startDate" },
        { name: "Ngày kết thúc", type: "endDate" },
        { name: "Giảm", type: "discountAmount" },
    ];

    const validationSchema = Yup.object(
        Object.keys(initialValues).reduce((schema, field) => {
            schema[field] = Yup.string().required(
                `${initialValues[field].label} là bắt buộc`
            );
            return schema;
        }, {})
    );

    const addData = useCallback(
        async ({
            name,
            condition,
            startDate,
            endDate,
            discountAmount,
            discountType,
        }) => {
            try {
                const res = await axios.post(`${config.API_URL}discounts`, {
                    name,
                    condition,
                    startDate,
                    endDate,
                    discountAmount,
                    discountType,
                });
                if (res.status === 201) {
                    setModal(false);
                    // Fetch lại toàn bộ data sau khi thêm
                    fetchData();
                    Swal.fire({
                        title: "Thêm thành công!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500, // Tự tắt sau 2 giây
                        timerProgressBar: true,
                    });
                }
            } catch (err) {
                Swal.fire({
                    title: "Thêm không thành công!",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            }
        },
        [fetchData]
    );

    const handleDeleteData = async () => {
        try {
            if (checkedRow.length === 0) {
                Swal.fire({
                    title: "Thông báo!",
                    text: "Bạn chưa chọn dữ liệu cần xóa.",
                    icon: "info",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    title: "Nhắc nhở",
                    text: "Bạn có chắc chắn muốn xóa không?",
                    icon: "info",
                    showCancelButton: true, // Show cancel button
                    confirmButtonText: "Xóa bỏ!",
                    cancelButtonText: "Hủy bỏ",
                    reverseButtons: true, // Optional: makes cancel button appear on the left
                    timerProgressBar: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteData(checkedRow);
                        Swal.fire({
                            title: "Xóa thành công!",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Xóa thất bại!",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        }
    };

    const deleteData = async (ids) => {
        const res = ids.every(async (id) => {
            await axios.delete(`${config.API_URL}discounts/${id}`);
            return true;
        });
        if (res === true) {
            // Uncheck các checkbox đã chọn
            document
                .querySelectorAll("input[type='checkbox']")
                .forEach((ckb) => (ckb.checked = false));
            setCheckedRow([]);

            // Set lại users
            setData(data.filter((d) => !checkedRow.includes(d._id)));
            setValidData(validData.filter((d) => !checkedRow.includes(d._id)));
        } else {
            console.log(res.data.message);
        }
    };

    useEffect(() => {
        fetchData(); // Gọi hàm fetchData
    }, [addData, fetchData]);
    return (
        <div className='wrapper'>
            <header className='admin-header'>
                <div className='container'>
                    <h2>QUẢN LÝ GIẢM GIÁ</h2>
                </div>
            </header>
            <main className='main'>
                <div className='container'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='card-tools'>
                                <Filter
                                    filters={filters}
                                    data={data}
                                    validData={validData}
                                    setValidData={setValidData}
                                    standardSearch={standardSearch}
                                    standardSort={standardSort}
                                />
                            </div>
                            <div className='card-btns'>
                                <button
                                    className='admin-btn'
                                    onClick={() => setModal(true)}
                                >
                                    Thêm
                                </button>
                                <button
                                    className='admin-btn del-btn'
                                    onClick={handleDeleteData}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                        <div className='card-body'>
                            <Table
                                rows={pageData}
                                columns={config.TABLE_DISCOUNT_COL}
                                setChecked={setCheckedRow}
                            />
                        </div>
                        <div className='card-footer'>
                            <div className='card-display-count'></div>
                            <Pagination
                                data={validData}
                                setPageData={setPageData}
                            />
                        </div>
                    </div>
                    <Modal
                        modal={modal}
                        setModal={setModal}
                        title={"Thêm người dùng"}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        handleAdd={addData}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdminDiscountList;