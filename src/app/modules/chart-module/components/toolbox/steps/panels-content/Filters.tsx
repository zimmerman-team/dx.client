/* third-party */
import React from "react";
/* project */
import { FilterGroupModel } from "app/components/ToolBoxPanel/components/filters/data";
import { FilterGroup } from "app/modules/chart-module/routes/filters/components/FilterGroup";
import { ExpandedFilterGroup } from "app/modules/chart-module/routes/filters/components/ExpandedFilterGroup";
import ToolboxSubHeader from "app/modules/chart-module/components/toolbox/steps/sub-header";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

interface ChartToolBoxFiltersProps {
  filterOptionGroups: FilterGroupModel[];
}

export function ChartToolBoxFilters(props: ChartToolBoxFiltersProps) {
  const { filterOptionGroups } = props;
  const [expandedGroup, setExpandedGroup] =
    React.useState<FilterGroupModel | null>(null);

  const resetAppliedFilters = useStoreActions(
    (state) => state.charts.appliedFilters.reset
  );

  const handleResetFilters = () => {
    resetAppliedFilters();
  };

  const expandGroup = (group: FilterGroupModel) => {
    setExpandedGroup(group);
  };

  return (
    <>
      <ToolboxSubHeader
        name="Filters"
        level={4}
        showResetButton
        resetFilters={handleResetFilters}
      />
      <div
        css={`
          width: 93%;
          margin: auto;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding-left: 9px;
          padding-bottom: 33px;
          position: relative;
          overflow-y: auto;
          max-height: calc(100vh - 260px);
          &::-webkit-scrollbar {
            width: 4px;
            background: #262c34;
          }
          &::-webkit-scrollbar-track {
            background: #f1f3f5;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background: #262c34;
          }
        `}
      >
        {!expandedGroup && (
          <React.Fragment>
            {filterOptionGroups.map((group: FilterGroupModel) => (
              <FilterGroup
                key={group.name}
                name={group.name}
                options={group.options}
                expandGroup={() => expandGroup(group)}
              />
            ))}
          </React.Fragment>
        )}
        {expandedGroup && (
          <ExpandedFilterGroup
            name={expandedGroup.name}
            options={expandedGroup.options}
            goBack={() => setExpandedGroup(null)}
          />
        )}
      </div>
    </>
  );
}
