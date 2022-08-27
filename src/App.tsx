import { Breadcrumb, Button, Col, Input, message, Row, Table } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchAPI } from "./utils/api";
import { getQueryObj } from "./utils/query";

function App() {
  const [users, setUsers] = useState({
    loading: false,
    list: [],
    pageSize: 10,
    page: 1,
    q: "",
  });

  const getUserList = async (page = 1, q = "", perPage = 25) => {
    setUsers((u) => ({ ...u, loading: true }));
    try {
      const resp = await fetchAPI("https://randomuser.me/api/", {
        payload: {
          seed: "user-user-ajaib",
          results: perPage,
          page,
        },
      });

      setUsers({
        list: resp.results,
        pageSize: resp.info?.results,
        loading: false,
        page,
        q,
      });
    } catch (error) {
      message.error(String(error));
      setUsers((u) => ({ ...u, loading: false }));
    }
  };

  useEffect(() => {
    const query = getQueryObj();
    getUserList(query.page, query.q);
  }, []);

  return (
    <Wrapper>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">Home</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Example Page</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Example With Search and Filter</h1>

      <Row gutter={[15, 15]}>
        <Col span={8}>
          <label>Search</label>
          {/* <Input.Search
            placeholder="Search User..."
            defaultValue={query.q || ""}
            onSearch={val => }
            enterButton
          /> */}
        </Col>
      </Row>

      <Table
        pagination={{
          position: ["bottomRight"],
          current: users.page,
          pageSize: users.pageSize,
          total: 5000,
          onChange: (page, pageSize) => {
            getUserList(
              pageSize !== users.pageSize ? 1 : page,
              users.q,
              pageSize
            );
          },
        }}
        rowKey="key"
        dataSource={users.list}
        loading={users.loading}
        columns={[
          {
            title: "No.",
            render: (value, record, index) => {
              return (users.page - 1) * users.pageSize + index + 1 + ".";
            },
            key: "no",
            width: 75,
          },
          {
            title: "Username",
            key: "uname",
            dataIndex: ["login", "username"],
          },
          {
            title: "Name",
            key: "name",
            dataIndex: "name",
            render: (value) => {
              return `${value?.first}  ${value?.last}`;
            },
          },
          {
            title: "Gender",
            key: "gender",
            dataIndex: "gender",
            render: (value) => {
              return value.charAt(0).toUpperCase() + value.slice(1);
            },
            width: 100,
          },
          {
            title: "Registered Date",
            key: "regDate",
            dataIndex: ["registered", "date"],
            render: (value) => {
              if (!value) {
                return "-";
              }

              return moment(value).format("DD-MM-YYYY HH:mm");
            },
          },
        ]}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 15px;
`;

export default App;
