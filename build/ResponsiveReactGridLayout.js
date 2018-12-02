"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ResponsiveReactGridLayout = require("../node_modules/react-grid-layout/build/ResponsiveReactGridLayout");

var _ResponsiveReactGridLayout2 = _interopRequireDefault(_ResponsiveReactGridLayout);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _ReactGridLayout = require("./ReactGridLayout");

var _ReactGridLayout2 = _interopRequireDefault(_ReactGridLayout);

var _lodash = require("lodash.isequal");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResponsivePatch = function (_Responsive) {
    _inherits(ResponsivePatch, _Responsive);

    function ResponsivePatch() {
        _classCallCheck(this, ResponsivePatch);

        return _possibleConstructorReturn(this, _Responsive.apply(this, arguments));
    }

    ResponsivePatch.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        // Allow parent to set width or breakpoint directly.
        console.log(nextProps, 'nextProps');
        if (nextProps.width != this.props.width || nextProps.breakpoint !== this.props.breakpoint || !(0, _lodash2.default)(nextProps.breakpoints, this.props.breakpoints) || !(0, _lodash2.default)(nextProps.cols, this.props.cols)) {
            this.onWidthChange(nextProps);
        }

        // Allow parent to set layouts directly.
        else if (!(0, _lodash2.default)(nextProps.layouts, this.props.layouts)) {
                var _state = this.state,
                    breakpoint = _state.breakpoint,
                    cols = _state.cols;

                // Since we're setting an entirely new layout object, we must generate a new responsive layout
                // if one does not exist.

                var newLayout = findOrGenerateResponsiveLayout(nextProps.layouts, nextProps.breakpoints, breakpoint, breakpoint, cols, nextProps.verticalCompact);
                this.setState({ layout: newLayout });
            }
    };

    ResponsivePatch.prototype.render = function render() {
        // eslint-disable-next-line no-unused-vars
        var _props = this.props,
            breakpoint = _props.breakpoint,
            breakpoints = _props.breakpoints,
            cols = _props.cols,
            layouts = _props.layouts,
            onBreakpointChange = _props.onBreakpointChange,
            onLayoutChange = _props.onLayoutChange,
            onWidthChange = _props.onWidthChange,
            other = _objectWithoutProperties(_props, ["breakpoint", "breakpoints", "cols", "layouts", "onBreakpointChange", "onLayoutChange", "onWidthChange"]);

        return _react2.default.createElement(_ReactGridLayout2.default, _extends({
            ref: "reactGridLayout"
        }, other, {
            onLayoutChange: this.onLayoutChange,
            layout: this.state.layout,
            cols: this.state.cols
        }));
    };

    return ResponsivePatch;
}(_ResponsiveReactGridLayout2.default);

exports.default = ResponsivePatch;