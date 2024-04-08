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

export default function Filter(
  props: Readonly<{
    searchValue: string;
    setSearchValue: (value: React.SetStateAction<string | undefined>) => void;
    setSortValue: React.Dispatch<React.SetStateAction<string>>;
    sortValue: string;
    setTableView: React.Dispatch<React.SetStateAction<boolean>>;
    tableView: boolean;
    terminateSearch?: () => void;
  }>
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [sortPopoverAnchorEl, setSortPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const handleCloseSortPopover = () => {
    setSortPopoverAnchorEl(null);
  };
  const openSortPopover = Boolean(sortPopoverAnchorEl);
  const [openSearch, setOpenSearch] = React.useState(false);
  const sortOptions = [
    { label: "Last updated", value: "updatedDate" },
    { label: "Created date", value: "createdDate" },
    { label: "Name", value: "name" },
  ];
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.terminateSearch && props.terminateSearch();
    props.setSearchValue(e.target.value);
  };

  return (
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
        <div css={searchInputCss(openSearch)}>
          <input
            type="text"
            ref={inputRef}
            value={props.searchValue}
            placeholder="eg. Kenya"
            onChange={handleSearch}
            data-cy="filter-search-input"
          />
          <IconButton
            onClick={() => {
              props.setSearchValue("");
              props.terminateSearch && props.terminateSearch();
              setOpenSearch(false);
            }}
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
          data-cy="open-search-button"
          onClick={() => {
            setOpenSearch(true);
            inputRef.current?.focus();
          }}
          css={iconButtonCss(openSearch)}
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
              props.setSortValue(option.value);
              handleCloseSortPopover();
            }}
          >
            {option.label}
          </div>
        ))}
      </Popover>
      <IconButton
        onClick={() => {
          props.setTableView(!props.tableView);
        }}
        css={iconButtonCss(props.tableView)}
      >
        <GridIcon />
      </IconButton>
    </div>
  );
}
