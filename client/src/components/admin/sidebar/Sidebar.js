import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
    const location = useLocation();
    const lastPathSegment = location.pathname.split("/").pop(); // Lấy phần cuối cùng của đường dẫn
    const [activeLink, setActiveLink] = useState(lastPathSegment);

    const handleLickClick = (link) => {
        setActiveLink(link);
    };

    return (
        <aside className='sidebar'>
            <div className='info'>
                <Link to='/'>Đăng xuất</Link>
            </div>
            <div className='toolbar'>
                <Link
                    className={
                        activeLink === "user" ||
                        activeLink === "admin" ||
                        activeLink === ""
                            ? "active"
                            : null
                    }
                    to='/admin/user'
                    onClick={() => handleLickClick("user")}
                >
                    Người dùng
                </Link>
                <Link
                    className={activeLink === "product" ? "active" : null}
                    to='/admin/product'
                    onClick={() => handleLickClick("product")}
                >
                    Sản phẩm
                </Link>
                <Link
                    className={activeLink === "cate" ? "active" : null}
                    to='/admin/cate'
                    onClick={() => handleLickClick("cate")}
                >
                    Danh mục
                </Link>
                <Link
                    className={activeLink === "invoice" ? "active" : null}
                    to='/admin/invoice'
                    onClick={() => handleLickClick("invoice")}
                >
                    Đơn hàng
                </Link>
                <Link
                    className={activeLink === "discount" ? "active" : null}
                    to='/admin/discount'
                    onClick={() => handleLickClick("discount")}
                >
                    Giảm giá
                </Link>
                <Link
                    className={activeLink === "statis" ? "active" : null}
                    to='/admin/statis'
                    onClick={() => handleLickClick("statis")}
                >
                    Thống kê
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;