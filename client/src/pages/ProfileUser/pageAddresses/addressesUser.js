import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  notification,
  Pagination,
} from "antd";
import styles from "./AddressesUser.module.scss";
import {
  getAddresses,
  addAddresses,
  deleteAddresses,
  editAddresses,
} from "../../../services/api/userService";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;
const { confirm } = Modal;

const AddressesUser = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const email = localStorage.getItem("userEmail");
  const [addresses, setAddresses] = useState([]);
  const addressesArray = Object.values(addresses);
  const fetchAddresses = async () => {
    try {
      const response = await getAddresses(email);
      setAddresses(response);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);

  const showModal = (type) => {
    setModalType(type);
    if (type === "add") {
      setAddressLine("");
      setDistrict("");
      setCity("");
      setCountry("");
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!addressLine || !district || !city || !country) {
      notification.error({
        message: "Thêm địa chỉ thất bại",
        description: "Tất cả các trường đều phải được điền.",
      });
      return;
    }
    try {
      await addAddresses(email, {
        addressLine,
        district,
        city,
        country,
      });
      fetchAddresses();
      setIsModalVisible(false);
      notification.success({
        message: "Thêm địa chỉ thành công",
        description: "Địa chỉ của bạn đã được thêm.",
      });
    } catch (error) {
      console.error("Error adding address:", error);
      notification.error({
        message: "Thêm địa chỉ thất bại",
        description: "Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.",
      });
    }
  };

  const handleEdit = async (id) => {
    const addressId = localStorage.setItem("addressId", id);
    const address = addresses.find((addr) => addr._id === id);
    setAddressLine(address.addressLine);
    setDistrict(address.district);
    setCity(address.city);
    setCountry(address.country);
    showModal("edit");
  };

  // const handleEditAddress = async () => {
  //   if (!addressLine || !district || !city || !country) {
  //       notification.error({
  //           message: "Sửa địa chỉ thất bại",
  //           description: "Tất cả các trường đều phải được điền.",
  //       });
  //       return;
  //   }
  //   const addressId = localStorage.getItem("addressId");
  //   try {
  //       await editAddresses(addressId, {
  //           addressLine,
  //           district,
  //           city,
  //           country,
  //       });
  //       fetchAddresses();
  //       setIsModalVisible(false);
  //   } catch (error) {
  //       console.error("Error editing address:", error);
  //   }
  // };

  const handleEditAddress = async () => {
    if (!addressLine || !district || !city || !country) {
      notification.error({
        message: "Sửa địa chỉ thất bại",
        description: "Tất cả các trường đều phải được điền.",
      });
      throw new Error("All fields are required");
    }
    const addressId = localStorage.getItem("addressId");
    try {
      await editAddresses(addressId, {
        addressLine,
        district,
        city,
        country,
      });
      fetchAddresses();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error editing address:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddresses(id);
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa địa chỉ này không?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        return handleDelete(id)
          .then(() => {
            notification.success({
              message: "Xóa địa chỉ thành công",
              description: "Địa chỉ của bạn đã được xóa.",
            });
          })
          .catch(() => {
            notification.error({
              message: "Xóa địa chỉ thất bại",
              description: "Có lỗi xảy ra khi xóa địa chỉ. Vui lòng thử lại.",
            });
          });
      },
      onCancel() {
        console.log("Hủy xóa");
      },
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const addressesPerPage = 6;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastAddress = currentPage * addressesPerPage;
  const indexOfFirstAddress = indexOfLastAddress - addressesPerPage;
  const currentAddresses = addressesArray.slice(
    indexOfFirstAddress,
    indexOfLastAddress,
  );

  return (
    <div className={styles.profile}>
      <div className={styles.profileUser}>
        <span style={{ fontSize: "24px", fontWeight: "300" }}>
          ĐỊA CHỈ CỦA BẠN
        </span>
        <div>
          <Button
            type="primary"
            onClick={() => showModal("add")}
            className={styles.resetPassword}
          >
            Thêm địa chỉ
          </Button>
        </div>
        <div className={styles.addressList}>
          <table className={`${styles.addressContent} ${styles.table}`}>
            <thead>
              <tr>
                <th>Địa chỉ</th>
                <th>Quận/Huyện</th>
                <th>Thành phố</th>
                <th>Quốc gia</th>
                <th style={{ textAlign: "center", width: "250px" }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {currentAddresses.map((address, index) => (
                <tr key={index} style={{ gap: "10px" }}>
                  <td>{address.addressLine}</td>
                  <td>{address.district}</td>
                  <td>{address.city}</td>
                  <td>{address.country}</td>
                  <td
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className={`${styles.editButton} editButton`}
                      onClick={() => handleEdit(address._id)}
                    >
                      <EditOutlined style={{ marginRight: "5px" }} />
                      Sửa
                    </button>
                    <button
                      className={`${styles.deleteButton} deleteButton`}
                      onClick={() => showDeleteConfirm(address._id)}
                    >
                      <DeleteOutlined style={{ marginRight: "5px" }} />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={currentPage}
            pageSize={addressesPerPage}
            total={addressesArray.length}
            onChange={handlePageChange}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </div>
      </div>

      {modalType === "add" && (
        <Modal
          title={"THÊM ĐỊA CHỈ MỚI"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button
              className={styles.button}
              key="submit"
              type="primary"
              onClick={handleOk}
            >
              Thêm địa chỉ
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Địa chỉ" required>
              <Input
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Quận huyện" required>
              <Input
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Thành phố" required>
              <Input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Quốc gia" required>
              <Input
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* {modalType === "edit" && (
        <Modal
          title={"SỬA ĐỊA CHỈ"}
          visible={isModalVisible}
          onOk={handleEditAddress}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button
              className={styles.button}
              key="submit"
              type="primary"
              onClick={() => {
                handleEditAddress()
                  .then(() => {
                    notification.success({
                      message: "Sửa địa chỉ thành công",
                      description: "Địa chỉ của bạn đã được cập nhật.",
                    });
                  })
                  .catch(() => {
                    notification.error({
                      message: "Sửa địa chỉ thất bại",
                      description:
                        "Có lỗi xảy ra khi cập nhật địa chỉ. Vui lòng thử lại.",
                    });
                  });
              }}
            >
              Sửa địa chỉ
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Địa chỉ" required>
              <Input
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Quận huyện" required>
              <Input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Thành phố" required>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </Form.Item>
            <Form.Item label="Quốc gia" required>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      )} */}

      {modalType === "edit" && (
        <Modal
          title={"SỬA ĐỊA CHỈ"}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button
              className={styles.button}
              key="submit"
              type="primary"
              onClick={async () => {
                try {
                  await handleEditAddress();
                  notification.success({
                    message: "Sửa địa chỉ thành công",
                    description: "Địa chỉ của bạn đã được cập nhật.",
                  });
                } catch (error) {}
              }}
            >
              Sửa địa chỉ
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Địa chỉ" required>
              <Input
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Quận huyện" required>
              <Input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Thành phố" required>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </Form.Item>
            <Form.Item label="Quốc gia" required>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default AddressesUser;
