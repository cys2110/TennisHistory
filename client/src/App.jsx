import "./App.css";
import { Layout, ConfigProvider, theme } from "antd";
import Head from "./components/Header/Header";
import Foot from "./components/Footer/Footer";
import Main from "./components/Main";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#8b5cf6",
          colorTextTertiary: "#a1a1aa",
        },
        components: {
          Select: {
            activeBorderColor: "#8b5cf6",
            hoverBorderColor: "#8b5cf6",
            colorBorder: "#8b5cf6",
            colorText: "#d4d4d8",
          },
          Card: {
            colorBgContainer: "#5b21b6",
          },
          Descriptions: {
            labelBg: "#5b21b6",
          },
          Table: {
            headerBg: "#5b21b6",
          },
          Progress: {
            circleTextFontSize: "1rem",
          },
          Button: {
            contentFontSizeSM: 12,
            linkHoverBg: "#a1a1aa",
          },
        },
      }}
    >
      <Layout className="font-fira">
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
          className="bg-violet-800"
        >
          <Head />
        </Header>
        <Content className="py-16 w-[75%] mx-auto">
          <Main />
        </Content>
        <Footer className="bg-violet-800">
          <Foot />
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
