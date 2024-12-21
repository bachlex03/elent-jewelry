import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import Tippy from "@tippyjs/react";
import HeadlessTippy from "@tippyjs/react/headless";
import Button from "../../../Button";
import {
  getParentCategories,
  getChildrenCategories,
} from "../../../../services/api/categoryService";
import {
  searchProducts,
  fetchProducts,
  getProductDetail,
  getProductbyCategory,
} from "../../../../services/api/productService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faSpinner,
  faMagnifyingGlass,
  faEllipsisVertical,
  faLanguage,
  faCircleQuestion,
  faKeyboard,
  faCloudUpload,
  faMessage,
  faUser,
  faCoins,
  faGear,
  faSignOut,
  faUserCircle,
  faUserAlt,
  faCartShopping,
  faFire,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { Wrapper as PopperWrapper } from "../../../Popper";
import AccountItem from "../../../AccountItem";
import Menu from "../../../Popper/Menu";
import "tippy.js/dist/tippy.css";
import {
  LoginOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import { Link, useNavigate, useParams, useLocation } from "react-router-dom";


function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [keyword, setKeyword] = useState(""); // State để lưu từ khóa tìm kiếm
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
  const [page, setPage] = useState(1); // State để quản lý trang
  const limit = 16; // Số sản phẩm hiển thị mỗi trang
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const { id } = useParams();
  const location = useLocation();


  const handleSaleClick = () => {
    try {
      navigate("/list-product", {
        state: {
          isCategory: false,
          categoryId: null,
          isSale: true,
          keyword: ""
        },
        replace: true 
      });
    } catch (error) {
      console.error("Lỗi khi xử lý yêu cầu:", error);
    }
  };

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component được mount
    const accessToken = localStorage.getItem("accessToken");
    const email = localStorage.getItem("userEmail");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (accessToken && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
    setCartItems(cart);
    setCartCount(cart.length);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (keyword.trim() === "") {
        setProducts([]);
        return;
      }

      console.log("Đang tìm kiếm với từ khóa:", keyword);
      const result = await searchProducts(keyword, limit, page);
      console.log("Kết quả tìm kiếm:", result);

      if (result.error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", result.error);
      } else {
        setProducts(result.products);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [keyword, page]);

  const handleInputChange = (value) => {
    setKeyword(value);
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/list-product?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  // Thêm hàm xử lý khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCart = () => {
    navigate("/cart/gio-hang-cua-ban");
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const categories = await getParentCategories();
        setMenuItems(categories); 
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchMenuItems();
  }, []);


  const handleMouseEnter = async (parentId) => {
    try {
      const children = await getChildrenCategories(parentId);
      setSubcategories((prev) => ({ ...prev, [parentId]: children })); // Cập nhật danh mục con cho danh mục cha
    } catch (error) {
      console.error("Lỗi khi lấy danh mục con:", error);
    }
  };

  // Thêm hàm xử lý click vào category
  const handleCategoryClick = async (categoryId) => {
    try {
      navigate("/list-product", {
        state: {
          isCategory: true,
          categoryId: categoryId,
          isSale: false,
          keyword: ""
        },
        replace: true 
      });
    } catch (error) {
      console.error("Lỗi khi xử lý yêu cầu:", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Link to="/" className={styles.logo}>
        <img
          width="230"
          height="50"
          src="//bizweb.dktcdn.net/100/461/213/themes/870653/assets/logo.png?1727259903818"
          data-src="//bizweb.dktcdn.net/100/461/213/themes/870653/assets/logo.png?1727259903818"
          alt="Caraluna"
          className="lazyload loaded"
          data-was-processed="true"
        />
      </Link>

      <div className={styles.center}>
        <div className={styles.search}>
          <input
            className={styles.input}
            placeholder="Tìm sản phẩm..."
            value={keyword}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FontAwesomeIcon
            className={styles.iconGlass}
            icon={faMagnifyingGlass}
            onClick={handleSearch}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className={styles.menu}>
          <ul>
          <li onClick={handleSaleClick} style={{ cursor: "pointer" }}>
              SALE
              <FontAwesomeIcon className={styles.iconFire} icon={faFire} />
            </li>
            {menuItems.map((item) => (
              <li
                key={item._id}
                onMouseEnter={() => handleMouseEnter(item._id)}
                // onClick={() => handleCategoryClick(item._id)}
              >
                {item.category_name.toUpperCase()}
                <div className={styles.submenu}>
                  <div className={styles.menu1}>
                    {subcategories[item._id] && subcategories[item._id].length > 0 ? (
                      <>
                        {subcategories[item._id].some(sub => sub.category_type === 'material') && (
                          <ul className={styles.ul1}>
                            <div className={styles.li1}>
                              <li className={styles.headerli}>Chất liệu</li>
                              <div className={styles.subcategories}>
                                {subcategories[item._id]
                                  .filter(sub => sub.category_type === 'material')
                                  .map(sub => (
                                    <li 
                                      key={sub._id} 
                                      onClick={() => handleCategoryClick(sub._id)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {sub.category_name}
                                    </li>
                                  ))}
                              </div>
                            </div>
                          </ul>
                        )}

                        {subcategories[item._id].some(sub => sub.category_type === 'audience') && (
                          <ul className={styles.ul1}>
                            <div className={styles.li1}>
                              <li className={styles.headerli}>Đối tượng</li>
                              <div className={styles.subcategories}>
                                {subcategories[item._id]
                                  .filter(sub => sub.category_type === 'audience')
                                  .map(sub => (
                                    <li 
                                      key={sub._id} 
                                      onClick={() => handleCategoryClick(sub._id)}
                                      style={{ cursor: 'pointer' }}
                                    >{sub.category_name}</li>
                                  ))}
                              </div>
                            </div>
                          </ul>
                        )}

                        {subcategories[item._id].some(sub => sub.category_type === 'category') && (
                          <ul className={styles.ul1}>
                            <div className={styles.li1}>
                              <li className={styles.headerli}>Loại</li>
                              <div className={styles.subcategories}>
                                {subcategories[item._id]
                                  .filter(sub => sub.category_type === 'category')
                                  .map(sub => (
                                    <li 
                                      key={sub._id} 
                                      onClick={() => handleCategoryClick(sub._id)}
                                      style={{ cursor: 'pointer' }}
                                    >{sub.category_name}</li>
                                  ))}
                              </div>
                            </div>
                          </ul>
                        )}

                        {subcategories[item._id].some(sub => sub.category_type === 'style') && (
                          <ul className={styles.ul1}>
                            <div className={styles.li1}>
                              <li className={styles.headerli}>Hình</li>
                              <div className={styles.subcategories}>
                                {subcategories[item._id]
                                  .filter(sub => sub.category_type === 'style')
                                  .map(sub => (
                                    <li 
                                      key={sub._id} 
                                      onClick={() => handleCategoryClick(sub._id)}
                                      style={{ cursor: 'pointer' }}
                                    >{sub.category_name}</li>
                                  ))}
                              </div>
                            </div>
                          </ul>
                        )}
                      </>
                    ) : (
                      <p>Không có danh mục con</p>
                    )}
                    <div className={styles.imageContainer}>
                      <img
                        src="https://bizweb.dktcdn.net/100/461/213/themes/870653/assets/mega-1-image-2.jpg?1732012753391"
                        alt="ảnh quà & đồ đôi"
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.right}>
        <div
          className={styles.account}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className={styles.circle}>
            <FontAwesomeIcon className={styles.iconUser} icon={faUserAlt} />
          </div>
          <div className={styles.taikhoan}>Tài khoản</div>
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              {isLoggedIn ? (
                <>
                  <Link to="/account" className={styles.dropdownItem}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ marginRight: "12px" }}
                    />
                    Tài khoản
                  </Link>
                  <div
                    style={{ cursor: "pointer" }}
                    className={styles.dropdownItem}
                    onClick={() => {
                      localStorage.clear();
                      setIsLoggedIn(false);
                      setUserEmail("");
                      setCartCount(0);
                      navigate("/");
                    }}
                  >
                    <LogoutOutlined style={{ marginRight: "10px" }} />
                    Đăng xuất
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className={styles.dropdownItem}>
                    <LoginOutlined style={{ marginRight: "10px" }} />
                    Đăng nhập
                  </Link>
                  <Link to="/register" className={styles.dropdownItem}>
                    <LogoutOutlined style={{ marginRight: "27px" }} />
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <div
          className={styles.box}
          onMouseEnter={() => setShowCartDropdown(true)}
          onMouseLeave={() => setShowCartDropdown(false)}
        >
          <div className={styles.circle} onClick={handleCart}>
            <FontAwesomeIcon
              className={styles.iconCart}
              icon={faCartShopping}
            />
            {cartCount > 0 && (
              <span className={styles.cartCount}>{cartCount}</span>
            )}
          </div>
          <div className={styles.giohang} onClick={handleCart}>
            Giỏ hàng
          </div>
          {showCartDropdown && (
            <div className={styles.cartDropdownMenu}>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div key={index} className={styles.cartItem}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.cartItemImage}
                    />
                    <div className={styles.cartItemDetails}>
                      <div className={styles.cartItemName}>{item.name}</div>
                      <div className={styles.cartItemPrice}>{item.price}</div>
                      <div className={styles.cartItemQuantity}>
                        Số lượng: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
              <div className={styles.dropDownMenuCart}>
                <ShoppingCartOutlined style={{ marginRight: "10px", marginTop: '5px' }} />
                <Link to="/cart/gio-hang-cua-ban" className={styles.menuCart}>
                  Xem giỏ hàng
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;