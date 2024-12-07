import { Auth0Provider } from "@auth0/auth0-react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { screen, render } from "@testing-library/react";
import { mockUseAuth0 } from "app/utils/mockAuth0";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import GridItem from "app/modules/home-module/components/AssetCollection/Stories/gridItem";
import { ContentState, EditorState } from "draft-js";

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
    id: "story-id",
    heading: EditorState.createWithContent(
      ContentState.createFromText("story-title")
    ),
    name: "story-description",
    color: "#ffffff",
    viz: <div data-testid="story-grid-item-viz-icon">story</div>,
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
  expect(screen.getByText("story-title")).toBeInTheDocument();
  expect(screen.getByText("story-description")).toBeInTheDocument();

  expect(screen.getByText("August 2021")).toBeInTheDocument();
});

test("viz icon should be visible", async () => {
  const { app } = appSetup({});
  render(app);
  expect(screen.getByTestId("story-grid-item-viz-icon")).toBeInTheDocument();
});

const storyMenuButton = "story-menu-button";
const storyDuplicateButton = "story-duplicate-button";
const storyDeleteButton = "story-delete-button";

test("menu popup should display when menu icon is clicked", async () => {
  const { app } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: storyMenuButton }));
  expect(
    screen.getByRole("button", { name: storyDuplicateButton })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: storyDeleteButton })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
});

test("if menu popup is open, it should close when user clicks overlay", async () => {
  const { app } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: storyMenuButton }));
  expect(
    screen.getByRole("button", { name: storyDuplicateButton })
  ).toBeInTheDocument();
  await user.click(screen.getByTestId("story-grid-item-menu-overlay"));
  expect(
    screen.queryByRole("button", { name: storyDuplicateButton })
  ).toBeNull();
});

test("delete button should be clickable if user is owner ans user is authenticated", async () => {
  const { app, props } = appSetup({});
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: storyMenuButton }));

  expect(
    screen.getByRole("button", { name: storyDeleteButton })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: storyDeleteButton }));
  expect(props.handleDelete).toHaveBeenCalledWith("story-id");
});

test("delete button should not be clickable if user is not owner", async () => {
  const { app, props } = appSetup({ owner: "random-user" });
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: storyMenuButton }));

  expect(
    screen.getByRole("button", { name: storyDeleteButton })
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: storyDeleteButton }),
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
  await user.click(screen.getByRole("button", { name: storyMenuButton }));

  expect(
    screen.getByRole("button", { name: storyDuplicateButton })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: storyDuplicateButton }));
  expect(props.handleDuplicate).toHaveBeenCalledWith("story-id");
});

test("duplicate button should not be clickable if user is not authenticated", async () => {
  const { app, props } = appSetup();
  const user = userEvent.setup();
  mockLoginStatus = false;
  render(app);
  await user.click(screen.getByRole("button", { name: storyMenuButton }));

  expect(
    screen.getByRole("button", { name: storyDuplicateButton })
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: storyDuplicateButton }),
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
  await user.click(screen.getByRole("button", { name: storyMenuButton }));

  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "edit-icon" }));
  expect(history.location.pathname).toBe(
    "/story/66904b45783f35006988513a/edit"
  );
});

test("edit link should not be clickable if user is not owner", async () => {
  const { app, props } = appSetup({
    id: "66904b45783f35006988513a",
    owner: "random-user",
  });
  const user = userEvent.setup();
  render(app);
  await user.click(screen.getByRole("button", { name: storyMenuButton }));

  expect(screen.getByRole("link", { name: "edit-icon" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("link", { name: "edit-icon" }), {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
});
