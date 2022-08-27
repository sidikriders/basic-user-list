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
    q: withDefault(StringParam, ""),
    page_size: withDefault(NumberParam, 25),
    gender: withDefault(StringParam, "all"),
  });
  const [users, setUsers] = useState({
    loading: false,
    list: [],
  });
  const [searchQ, setSearchQ] = useState("");

  const getUserList = async (page: number, q: string, perPage: number) => {
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
        loading: false,
      });
    } catch (error) {
      message.error(String(error));
      setUsers((u) => ({ ...u, loading: false }));
    }
  };

  useEffect(() => {
    getUserList(query.page, query.q, query.page_size);
    setSearchQ(query.q);
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

      <Row gutter={[15, 15]}>
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
            value={query.gender}
            placeholder="Select Gender"
            onChange={(val) => setQuery({ gender: val || undefined })}
            allowClear
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="f">Female</Select.Option>
            <Select.Option value="m">Male</Select.Option>
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
          onChange: (page, pageSize) => {
            setQuery({
              page: pageSize !== query.page_size ? 1 : page,
              page_size: pageSize,
            });
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
