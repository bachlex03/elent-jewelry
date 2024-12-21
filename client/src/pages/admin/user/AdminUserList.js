import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Pagination from "../../../components/admin/pagination/Pagination";
import Table from "../../../components/admin/table/Table";
import Filter from "../../../components/admin/filter/Filter";
import Modal from "../../../components/admin/modal/Modal";
import config from "../../../config";

const AdminUserList = () => {
    const API_URL = `${config.API_URL}/admin/users`;
    const [data, setData] = useState([]);
    const [validData, setValidData] = useState([]);
    const [pageData, setPageData] = useState([]);
    const [checkedRow, setCheckedRow] = useState([]);
    let [modal, setModal] = useState(false);
    const [filters, setFilters] = useState([]);
    const [initialValues, setInitialValues] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(API_URL);
            setData(res.data.users);
            setValidData(res.data.users);
            setPageData(res.data.users.slice(0, config.LIMIT));
            setFilters([
                {
                    name: "Xác nhận",
                    type: "verified",
                    standards: ["Tất cả", "Đang hoạt động", "Chưa kích hoạt"],
                },
            ]);
            setInitialValues({
                lastName: { label: "Họ", type: "text", value: "" },
                firstName: { label: "Tên", type: "text", value: "" },
                email: { label: "Email", type: "email", value: "" },
                phoneNumber: {
                    label: "Số điện thoại",
                    type: "phone",
                    value: "",
                },
                password: { label: "Mật khẩu", type: "password", value: "" },
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, [API_URL]);
    const standardSearch = ["fullName", "email", "phone"];
    const standardSort = [
        { name: "Họ tên", type: "fullName" },
        { name: "Ngày tạo", type: "createdAt" },
    ];

    const validationSchema = Yup.object(
        Object.keys(initialValues).reduce((schema, field) => {
            schema[field] = Yup.string().required(
                `${initialValues[field].label} là bắt buộc`
            );
            if (field === 'phoneNumber') {
                schema[field] = schema[field]
                    .matches(/^0\d{9}$/, "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số");
            }
            if (field === 'password') {
                schema[field] = schema[field]
                    .min(8, "Mật khẩu phải có ít nhất 8 ký tự");
            }
            return schema;
        }, {})
    );

    const addUser = useCallback(
        async ({ lastName, firstName, email, phoneNumber, password }) => {
            try {
                const res = await axios.post(
                    `${config.API_URL}/auth/register`,
                    {
                        lastName: lastName,
                        firstName: firstName,
                        email: email,
                        phoneNumber: phoneNumber,
                        password: password,
                    }
                );
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
        [API_URL, fetchData]
    );

    useEffect(() => {
        fetchData(); // Gọi hàm fetchData
    }, [addUser, fetchData]);
    return (
        <div className='wrapper'>
            <header className='admin-header'>
                <div className='container'>
                    <h2>QUẢN LÝ NGƯỜI DÙNG</h2>
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
                            </div>
                        </div>
                        <div className='card-body'>
                            <Table
                                rows={pageData}
                                columns={config.TABLE_USER_COL}
                                rowLink={`/admin/user`}
                                isUser={true}
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
                        handleAdd={addUser}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdminUserList;