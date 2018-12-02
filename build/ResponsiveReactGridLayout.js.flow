import Responsive from "../node_modules/react-grid-layout/build/ResponsiveReactGridLayout";
import React from "react";
import ReactGridLayout from './ReactGridLayout'
import isEqual from "lodash.isequal";

export default class ResponsivePatch extends Responsive {
    componentWillReceiveProps(nextProps) {
        // Allow parent to set width or breakpoint directly.
        console.log(nextProps,'nextProps');
        if (
             nextProps.width != this.props.width
          || nextProps.breakpoint !== this.props.breakpoint
          || !isEqual(nextProps.breakpoints, this.props.breakpoints)
          || !isEqual(nextProps.cols, this.props.cols)
        ) {
          this.onWidthChange(nextProps);
        }
    
        // Allow parent to set layouts directly.
        else if (!isEqual(nextProps.layouts, this.props.layouts)) {
          const {breakpoint, cols} = this.state;
    
          // Since we're setting an entirely new layout object, we must generate a new responsive layout
          // if one does not exist.
          const newLayout = findOrGenerateResponsiveLayout(
            nextProps.layouts, nextProps.breakpoints,
            breakpoint, breakpoint, cols, nextProps.verticalCompact
          );
          this.setState({layout: newLayout});
        }
      }
    render() {
        // eslint-disable-next-line no-unused-vars
        const {
            breakpoint,
            breakpoints,
            cols,
            layouts,
            onBreakpointChange,
            onLayoutChange,
            onWidthChange,
            ...other
        } = this.props;
        return (
            <ReactGridLayout
                ref="reactGridLayout"
                {...other}
                onLayoutChange={this.onLayoutChange}
                layout={this.state.layout}
                cols={this.state.cols}
            />
        );
    }
}
