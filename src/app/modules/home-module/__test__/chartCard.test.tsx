import { Auth0Provider } from "@auth0/auth0-react";
import { render } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { mockUseAuth0 } from "app/utils/mockAuth0";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import GridItem from "../components/AssetCollection/Charts/gridItem";

interface MockProps {
  id: string;
  title: string;
  date: string;
  vizType: string;
  viz: React.ReactNode;
  isMappingValid: boolean;
  handleDelete?: jest.Mock<any, any, any>;
  handleDuplicate?: jest.Mock<any, any, any>;
  owner: string;
  isAIAssisted: boolean;
}

let mockLoginStatus = true;
jest.mock("axios");
jest.mock("@auth0/auth0-react", () => {
  const originalModule = jest.requireActual("@auth0/auth0-react");
  return {
    __esModule: true,
    ...originalModule,
    useAuth0: () => mockUseAuth0(mockLoginStatus),
    Auth0Provider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});
const history = createMemoryHistory({ initialEntries: ["/"] });

const defaultProps = (newProps: Partial<MockProps> = {}): MockProps => {
  return {
    id: "chart-id",
    title: "chart-title",
    date: "2021-08-13",
    vizType: "echartsBarchart",
    viz: <div data-testid="chart-grid-item-viz-icon">chart</div>,
    isMappingValid: true,
    handleDelete: jest.fn(),
    handleDuplicate: jest.fn(),
    owner: "auth0|123",
    isAIAssisted: false,
    ...newProps,
  } as MockProps;
};
const appSetup = (newProps: Partial<MockProps> = {}) => {
  const props = defaultProps(newProps);
  return {
    app: (
      <Auth0Provider clientId="__test_client_id__" domain="__test_domain__">
        <Router history={history}>
          <GridItem {...props} />
        </Router>
      </Auth0Provider>
    ),
    props,
  };
};

test("card should display chart title, and date", async () => {
  const { app } = appSetup({});
  render(app);
  expect(screen.getByText("chart-title")).toBeInTheDocument();
  expect(screen.getByText("August 2021")).toBeInTheDocument();
});

test("ai tag should not be visible if chart isAIAssisted is false", async () => {
  const { app } = appSetup({});
  render(app);
  expect(screen.queryByTestId("chart-grid-item-ai-icon")).toBeNull();
});

test("ai tag should be visible if chart is isAIAssisted is true", async () => {
  const { app } = appSetup({ isAIAssisted: true });
  render(app);
  expect(screen.getByTestId("chart-grid-item-ai-icon")).toBeInTheDocument();
});
test("viz icon should be visible", async () => {
  const { app } = appSetup({});
  render(app);
  expect(screen.getByTestId("chart-grid-item-viz-icon")).toBeInTheDocument();
});

test("menu popup should display when menu icon is clicked", async () => {
  const { app } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByTestId("chart-grid-item-menu-btn"));
  expect(
    screen.getByRole("button", { name: "duplicate-button" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "delete-button" })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
});

test("if menu popup is open, it shouldd close when user clicks overlay", async () => {
  const { app } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByTestId("chart-grid-item-menu-btn"));
  expect(
    screen.getByRole("button", { name: "duplicate-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByTestId("chart-grid-item-menu-overlay"));
  expect(screen.queryByRole("button", { name: "duplicate-button" })).toBeNull();
});

test("delete button should be clickable if user is owner ans user is authenticated", async () => {
  const { app, props } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByTestId("chart-grid-item-menu-btn"));

  expect(
    screen.getByRole("button", { name: "delete-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "delete-button" }));
  expect(props.handleDelete).toHaveBeenCalledWith("chart-id");
});

test("delete button should not be clickable if user is not owner", async () => {
  const { app, props } = appSetup({ owner: "random-user" });
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByTestId("chart-grid-item-menu-btn"));
  expect(
    screen.getByRole("button", { name: "delete-button" })
  ).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "delete-button" }), {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
  expect(props.handleDelete).not.toHaveBeenCalled();
});

test("duplicate button should be clickable if user is owner ans user is authenticated ", async () => {
  const { app, props } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByTestId("chart-grid-item-menu-btn"));

  expect(
    screen.getByRole("button", { name: "duplicate-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "duplicate-button" }));
  expect(props.handleDuplicate).toHaveBeenCalledWith("chart-id");
});

test("duplicate button should not be clickable if user is not authenticated", async () => {
  const { app, props } = appSetup();
  const user = userEvent.setup();
  mockLoginStatus = false;
  render(app);
  await user.click(screen.getByTestId("chart-grid-item-menu-btn"));
  expect(
    screen.getByRole("button", { name: "duplicate-button" })
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "duplicate-button" }),
    {
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    }
  );
  expect(props.handleDuplicate).not.toHaveBeenCalled();
});

test("edit link should be clickable if user is owner and user is authenticated ", async () => {
  const { app, props } = appSetup({ id: "66904b45783f35006988513a" });
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByTestId("chart-grid-item-menu-btn"));

  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "edit-icon" }));
  expect(history.location.pathname).toBe(
    "/chart/66904b45783f35006988513a/customize"
  );
});

test("edit link should not be clickable if user is not owner", async () => {
  const { app, props } = appSetup({
    id: "66904b45783f35006988513a",
    owner: "random-user",
  });
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByTestId("chart-grid-item-menu-btn"));
  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("link", { name: "edit-icon" }), {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
});

test("clicking edit link should redirect to mapping page is props.isMappingValid is false", async () => {
  const { app, props } = appSetup({
    id: "66904b45783f35006988513a",
    isMappingValid: false,
  });
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByTestId("chart-grid-item-menu-btn"));

  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "edit-icon" }));
  expect(history.location.pathname).toBe(
    "/chart/66904b45783f35006988513a/mapping"
  );
});
