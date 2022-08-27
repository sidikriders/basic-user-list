import {
  Breadcrumb,
  Button,
  Col,
  Input,
  message,
  Row,
  Select,
  Table,
} from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import { fetchAPI } from "./utils/api";

function App() {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    q: StringParam,
    page_size: withDefault(NumberParam, 10),
    gender: StringParam,
    sortOrder: StringParam,
    sortBy: StringParam,
  });
  const [users, setUsers] = useState({
    loading: false,
    list: [],
  });
  const [searchQ, setSearchQ] = useState("");

  const getUserList = async () => {
    setUsers((u) => ({ ...u, loading: true }));
    try {
      const resp = await fetchAPI("https://randomuser.me/api/", {
        payload: {
          seed: "basic-user-list",
          results: query.page_size,
          pageSize: query.page_size,
          page: query.page,
          keyword: query.q,
          gender: query.gender,
        },
      });

      setUsers({
        list: resp.results,
        loading: false,
      });
    } catch (error) {
      message.error(String(error));
      setUsers((u) => ({ ...u, loading: false }));
    }
  };

  useEffect(() => {
    getUserList();
    setSearchQ(String(query.q || ""));
  }, Object.values(query));

  return (
    <Wrapper>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">Home</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Example Page</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Example With Search and Filter</h1>

      <Row gutter={[15, 15]} className="filter-container">
        <Col span={8}>
          <label>Search</label>
          <Input.Search
            placeholder="Search User..."
            value={searchQ}
            onSearch={(val) => setQuery({ q: val || undefined, page: 1 })}
            onChange={(e) => {
              e.persist();
              setSearchQ(e.target?.value);
            }}
            enterButton
            allowClear
          />
        </Col>
        <Col span={8}>
          <label>Gender</label>
          <Select
            value={query.gender || "all"}
            placeholder="Select Gender"
            onChange={(val) => setQuery({ gender: val || undefined })}
            allowClear
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="male">Male</Select.Option>
          </Select>
        </Col>
        <Col span={8}>
          <Button
            onClick={() => {
              setQuery({
                page: undefined,
                page_size: undefined,
                q: undefined,
                gender: undefined,
              });
              setSearchQ("");
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>

      <Table
        pagination={{
          position: ["bottomRight"],
          current: query.page,
          pageSize: query.page_size,
          total: 5000,
          style: {
            marginBottom: 0,
          },
        }}
        rowKey="key"
        dataSource={users.list}
        loading={users.loading}
        columns={[
          {
            title: "No.",
            render: (value, record, index) => {
              return (query.page - 1) * query.page_size + index + 1 + ".";
            },
            key: "no",
            width: 75,
          },
          {
            title: "Username",
            key: "username",
            dataIndex: ["login", "username"],
            sorter: true,
          },
          {
            title: "Name",
            key: "name",
            dataIndex: "name",
            render: (value) => {
              return `${value?.first}  ${value?.last}`;
            },
            sorter: true,
          },
          {
            title: "Gender",
            key: "gender",
            dataIndex: "gender",
            render: (value) => {
              return value.charAt(0).toUpperCase() + value.slice(1);
            },
            width: 100,
            sorter: true,
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
            sorter: true,
          },
        ]}
        scroll={{
          y: "calc(100vh - 284.43px)",
        }}
        onChange={(pagination, filters, sorter, { action }) => {
          if (action === "sort") {
            setQuery({
              sortOrder: sorter.order,
              sortBy: !!sorter.order ? sorter.columnKey : undefined,
            });
          }

          if (action === "paginate") {
            setQuery({
              page:
                pagination.pageSize !== query.page_size
                  ? 1
                  : pagination.current,
              page_size: pagination.pageSize,
            });
          }
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 15px;

  .filter-container {
    max-width: 1000px;
    margin: 15px 0;

    label {
      display: block;
    }

    .ant-select {
      width: 100%;
    }

    .ant-col > .ant-btn {
      margin-top: 21.99px;
    }
  }
`;

export default App;
