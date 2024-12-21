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
    const API_URL = `${config.API_URL}admin`;
    const [data, setData] = useState([]);
    const [validData, setValidData] = useState([]);
    const [pageData, setPageData] = useState([]);
    const [checkedRow, setCheckedRow] = useState([]);
    let [modal, setModal] = useState(false);
    const [filters, setFilters] = useState([]);
    const [initialValues, setInitialValues] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/getAllProducts`);
            setData(res.data.products);
            setValidData(res.data.products);
            setPageData(res.data.products.slice(0, config.LIMIT));

            const resCate = await axios.get(`${API_URL}/getAllCategories`);
            setFilters([
                {
                    name: "Danh mục",
                    type: "category",
                    standards: [
                        "Tất cả",
                        ...resCate.data.categories.map((d) => d.category_name),
                    ],
                },
            ]);
            setInitialValues({
                product_code: { label: "Mã sản phẩm", type: "text", value: "" },
                product_name: {
                    label: "Tên sản phẩm",
                    type: "text",
                    value: "",
                },
                product_price: {
                    label: "Giá sản phẩm",
                    type: "number",
                    value: "",
                },
                product_sale_price: {
                    label: "Giá khuyến mãi",
                    type: "number",
                    value: "",
                },
                category: {
                    label: "Danh mục",
                    type: "select",
                    value: resCate.data.categories[0]._id,
                    options: [
                        ...resCate.data.categories.map((d) => d.category_name),
                    ],
                    options_value: [
                        ...resCate.data.categories.map((d) => d._id),
                    ],
                },
                product_short_description: {
                    label: "Mô tả ngắn",
                    type: "text",
                    value: "",
                },
                product_images: {
                    label: "Hình ảnh",
                    type: "file",
                    value: [],
                },
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, [API_URL]);
    const standardSearch = ["product_name", "product_code", "category"];
    const standardSort = [
        { name: "Tên sản phẩm", type: "product_name" },
        { name: "Giá bán", type: "product_sale_price" },
        { name: "Ngày tạo", type: "createdAt" },
    ];

    const addProduct = useCallback(
        async ({
            product_code,
            product_name,
            product_price,
            product_sale_price,
            category,
            product_short_description,
            product_images,
        }) => {
            const schema = Yup.object().shape({
                product_price: Yup.number()
                    .positive("Giá sản phẩm phải lớn hơn 0")
                    .required("Giá sản phẩm là bắt buộc"),
                product_sale_price: Yup.number()
                    .positive("Giá khuyến mãi phải lớn hơn 0")
                    .nullable()
                    .lessThan(Yup.ref('product_price'), "Giá khuyến mãi phải nhỏ hơn giá sản phẩm")
                    .required("Giá khuyến mãi là bắt buộc nếu có giá trị"),
            });

            try {
                await schema.validate({
                    product_price,
                    product_sale_price,
                });
                const formData = new FormData();
                formData.append("product_code", product_code);
                formData.append("product_name", product_name);
                formData.append("product_price", product_price);
                formData.append("product_sale_price", product_sale_price);
                formData.append("product_category", category);
                formData.append(
                    "product_short_description",
                    product_short_description
                );

                formData.append(
                    "product_details",
                    JSON.stringify({
                        material: "Vàng",
                        color: "vàng",
                        length: "40cm",
                        design_style: "Cổ điển",
                    })
                );
                const productImages =
                    document.querySelector('input[type="file"]').files;
                // Append images
                for (let i = 0; i < productImages.length; i++) {
                    formData.append("product_images", productImages[i]);
                }
                const res = await axios.post(
                    `${config.API_URL}products`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
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
                    title: "Lỗi xác thực!",
                    text: err.errors.join(", "),
                    icon: "error",
                    showConfirmButton: true,
                });
                return;
            }
        },
        [API_URL, fetchData]
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
            await axios.delete(`${config.API_URL}products/${id}`);
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
    }, [addProduct, fetchData]);
    return (
        <div className='wrapper'>
            <header className='admin-header'>
                <div className='container'>
                    <h2>QUẢN LÝ SẢN PHẨM</h2>
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
                                columns={config.TABLE_PRODUCT_COL}
                                rowLink={`/admin/product`}
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
                        title={"Thêm sản phẩm"}
                        initialValues={initialValues}
                        handleAdd={addProduct}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdminUserList;