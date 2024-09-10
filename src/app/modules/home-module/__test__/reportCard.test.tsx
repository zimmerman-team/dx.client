import { Auth0Provider } from "@auth0/auth0-react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { screen, render } from "@testing-library/react";
import { mockUseAuth0 } from "app/utils/mockAuth0";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import GridItem from "app/modules/home-module/components/AssetCollection/Reports/gridItem";
import { EditorState } from "draft-js";

interface MockProps {
  date: Date;
  id?: string;
  title: string;
  name: string;
  color: string;
  viz: JSX.Element;
  handleDelete?: jest.Mock<any, any, any>;
  handleDuplicate?: jest.Mock<any, any, any>;
  showMenuButton: boolean;
  owner: string;
  heading: EditorState;
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
    date: "2021-08-13",
    id: "report-id",
    title: "report-title",
    name: "report-description",
    color: "#ffffff",
    viz: <div data-testid="report-grid-item-viz-icon">report</div>,
    handleDelete: jest.fn(),
    handleDuplicate: jest.fn(),
    showMenuButton: true,
    owner: "auth0|123",
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

test("card should display chart title, description and date", async () => {
  const { app } = appSetup({});
  render(app);
  expect(screen.getByText("report-title")).toBeInTheDocument();
  expect(screen.getByText("report-description")).toBeInTheDocument();

  expect(screen.getByText("August 2021")).toBeInTheDocument();
});

test("viz icon should be visible", async () => {
  const { app } = appSetup({});
  render(app);
  expect(screen.getByTestId("report-grid-item-viz-icon")).toBeInTheDocument();
});

test("menu popup should display when menu icon is clicked", async () => {
  const { app } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: "report-menu-button" }));
  expect(
    screen.getByRole("button", { name: "report-duplicate-button" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "report-delete-button" })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
});

test("if menu popup is open, it should close when user clicks overlay", async () => {
  const { app } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: "report-menu-button" }));
  expect(
    screen.getByRole("button", { name: "report-duplicate-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByTestId("report-grid-item-menu-overlay"));
  expect(
    screen.queryByRole("button", { name: "report-duplicate-button" })
  ).toBeNull();
});

test("delete button should be clickable if user is owner ans user is authenticated", async () => {
  const { app, props } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: "report-menu-button" }));

  expect(
    screen.getByRole("button", { name: "report-delete-button" })
  ).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "report-delete-button" })
  );
  expect(props.handleDelete).toHaveBeenCalledWith("report-id");
});

test("delete button should not be clickable if user is not owner", async () => {
  const { app, props } = appSetup({ owner: "random-user" });
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: "report-menu-button" }));

  expect(
    screen.getByRole("button", { name: "report-delete-button" })
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "report-delete-button" }),
    {
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    }
  );
  expect(props.handleDelete).not.toHaveBeenCalled();
});

test("duplicate button should be clickable if user is owner ans user is authenticated ", async () => {
  const { app, props } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: "report-menu-button" }));

  expect(
    screen.getByRole("button", { name: "report-duplicate-button" })
  ).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "report-duplicate-button" })
  );
  expect(props.handleDuplicate).toHaveBeenCalledWith("report-id");
});

test("duplicate button should not be clickable if user is not authenticated", async () => {
  const { app, props } = appSetup();
  const user = userEvent.setup();
  mockLoginStatus = false;
  render(app);
  await user.click(screen.getByRole("button", { name: "report-menu-button" }));

  expect(
    screen.getByRole("button", { name: "report-duplicate-button" })
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "report-duplicate-button" }),
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
  await user.click(screen.getByRole("button", { name: "report-menu-button" }));

  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "edit-icon" }));
  expect(history.location.pathname).toBe(
    "/report/66904b45783f35006988513a/edit"
  );
});

test("edit link should not be clickable if user is not owner", async () => {
  const { app, props } = appSetup({
    id: "66904b45783f35006988513a",
    owner: "random-user",
  });
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: "report-menu-button" }));

  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("link", { name: "edit-icon" }), {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
});
