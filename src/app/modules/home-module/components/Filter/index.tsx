import React from "react";
import {
  iconButtonCss,
  rowFlexCss,
  searchInputCss,
  sortByItemCss,
} from "app/modules/home-module/style";
import { IconButton, Popover } from "@material-ui/core";
import { ReactComponent as SortIcon } from "app/modules/home-module/assets/sort-fill.svg";
import { ReactComponent as GridIcon } from "app/modules/home-module/assets/grid-fill.svg";
import { ReactComponent as CloseIcon } from "app/modules/home-module/assets/close-icon.svg";
import { ReactComponent as SearchIcon } from "app/modules/home-module/assets/search-fill.svg";
import { ReactComponent as TableIcon } from "app/modules/home-module/assets/table-icon.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";

export default function Filter(
  props: Readonly<{
    searchValue: string;
    setSearchValue: (value: React.SetStateAction<string | undefined>) => void;
    setSortValue: (value: "updatedDate" | "createdDate" | "name") => void;
    sortValue: string;
    setAssetsView: (value: "grid" | "table") => void;
    assetsView: "table" | "grid";
    terminateSearch?: () => void;
    searchInputWidth?: string;
    openSearch: boolean;
    setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
    searchIconCypressId: string;
  }>
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [displayIcons, setDisplayIcons] = React.useState(true);
  const [sortPopoverAnchorEl, setSortPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const handleCloseSortPopover = () => {
    setSortPopoverAnchorEl(null);
  };
  const openSortPopover = Boolean(sortPopoverAnchorEl);
  const sortOptions = [
    { label: "Last updated", value: "updatedDate" },
    { label: "Created date", value: "createdDate" },
    { label: "Name", value: "name" },
  ];
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.terminateSearch && props.terminateSearch();
    props.setSearchValue(e.target.value);
  };
  const handleIconsDisplay = () => {
    setDisplayIcons(!displayIcons);
  };

  return (
    <div
      css={`
        ${rowFlexCss}
        justify-content: flex-start;
        flex-direction: row-reverse;
        gap: 8px;
      `}
    >
      <div
        css={`
          ${rowFlexCss}
          justify-content: flex-end;
          gap: 8px;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 8px;
          `}
        >
          <div css={searchInputCss(props.openSearch, props.searchInputWidth)}>
            <input
              type="text"
              ref={inputRef}
              value={props.searchValue}
              placeholder="eg. Kenya"
              onChange={handleSearch}
              data-cy="filter-search-input"
              aria-label="search"
            />
            <IconButton
              onClick={() => {
                props.setSearchValue("");
                props.terminateSearch && props.terminateSearch();
                props.setOpenSearch(false);
              }}
              aria-label="close-search"
              css={`
                &:hover {
                  background: transparent;
                }
              `}
            >
              <CloseIcon
                css={`
                  margin-top: 1px;
                `}
              />
            </IconButton>
          </div>
          <IconButton
            data-cy={props.searchIconCypressId}
            onClick={() => {
              props.setOpenSearch(true);
              inputRef.current?.focus();
            }}
            css={iconButtonCss(props.openSearch)}
            aria-label="search-button"
          >
            <SearchIcon />
          </IconButton>
        </div>
        <IconButton
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setSortPopoverAnchorEl(
              sortPopoverAnchorEl ? null : event.currentTarget
            );
          }}
          css={iconButtonCss(openSortPopover)}
          aria-label="sort-button"
        >
          <SortIcon />
        </IconButton>
        <Popover
          open={openSortPopover}
          anchorEl={sortPopoverAnchorEl}
          onClose={handleCloseSortPopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          css={`
            .MuiPaper-root {
              border-radius: 5px;
            }
          `}
        >
          <div
            css={`
              color: #fff;
              font-size: 12px;
              padding: 8px 22px;
              background: #231d2c;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            `}
          >
            Sort by
          </div>
          {sortOptions.map((option) => (
            <div
              key={option.label}
              css={sortByItemCss(props.sortValue === option.value)}
              onClick={() => {
                props.terminateSearch && props.terminateSearch();
                props.setSortValue(
                  option.value as "name" | "createdDate" | "updatedDate"
                );
                handleCloseSortPopover();
              }}
            >
              {option.label}
            </div>
          ))}
        </Popover>
        <IconButton
          data-cy="home-table-view-button"
          onClick={() => {
            props.setAssetsView(
              props.assetsView === "table" ? "grid" : "table"
            );
          }}
          css={iconButtonCss(props.assetsView === "table")}
          aria-label={`${
            props.assetsView === "table" ? "grid" : "table"
          }-view-button`}
        >
          {props.assetsView === "table" ? <TableIcon /> : <GridIcon />}
        </IconButton>
      </div>
    </div>
  );
}
