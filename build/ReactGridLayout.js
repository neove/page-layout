'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactGridLayout = require('../node_modules/react-grid-layout');

var _reactGridLayout2 = _interopRequireDefault(_reactGridLayout);

var _GridItem = require('../node_modules/react-grid-layout/build/GridItem');

var _GridItem2 = _interopRequireDefault(_GridItem);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getLayoutItem = _reactGridLayout.utils.getLayoutItem,
    childrenEqual = _reactGridLayout.utils.childrenEqual,
    synchronizeLayoutWithChildren = _reactGridLayout.utils.synchronizeLayoutWithChildren,
    moveElement = _reactGridLayout.utils.moveElement,
    compact = _reactGridLayout.utils.compact;

var PatchReactGridLayout = function (_ReactGridLayout) {
  _inherits(PatchReactGridLayout, _ReactGridLayout);

  function PatchReactGridLayout() {
    _classCallCheck(this, PatchReactGridLayout);

    return _possibleConstructorReturn(this, _ReactGridLayout.apply(this, arguments));
  }

  PatchReactGridLayout.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {

    var newLayoutBase = void 0;
    // Allow parent to set layout directly.
    if (!(0, _lodash2.default)(nextProps.layout, this.props.layout)) {
      newLayoutBase = nextProps.layout;
    } else if (!childrenEqual(this.props.children, nextProps.children)) {
      // If children change, also regenerate the layout. Use our state
      // as the base in case because it may be more up to date than
      // what is in props.
      newLayoutBase = this.state.layout;
    }
    //如果有占位组件的话
    var placeHolderCompoentIndex = nextProps.layout.findIndex(function (item) {
      return item.isPlaceHolder;
    });
    // We need to regenerate the layout.
    if (newLayoutBase) {
      var newLayout = synchronizeLayoutWithChildren(newLayoutBase, nextProps.children, nextProps.cols, nextProps.verticalCompact);
      var oldLayout = this.state.layout;
      if (placeHolderCompoentIndex !== -1) {
        var placeHolderCom = nextProps.layout[placeHolderCompoentIndex];
        var x = placeHolderCom.x,
            y = placeHolderCom.y,
            i = placeHolderCom.i;

        var newPlaceHolderCom = newLayout.find(function (item) {
          return item.i === i;
        });
        newLayout = moveElement(newLayout, newPlaceHolderCom, x, y, true /* isUserAction */);
        newLayout = compact(newLayout, nextProps.verticalCompact);
      }
      this.setState({ layout: newLayout });
      this.onLayoutMaybeChanged(newLayout, oldLayout);
    }
  };

  PatchReactGridLayout.prototype.showPlaceHolderWhileDrag = function showPlaceHolderWhileDrag(pixelX, pixelY, i) {
    var _refs$gridItem$calcXY = this.refs.gridItem.calcXY(pixelY, pixelX),
        x = _refs$gridItem$calcXY.x,
        y = _refs$gridItem$calcXY.y;
    //  const {oldDragItem} = this.state;


    var layout = this.state.layout;

    var l = getLayoutItem(layout, i);
    // console.log(layout);
    if (!l) return;
    // Create placeholder (display only)
    // var placeholder = {
    //   w: l.w, h: l.h, x: l.x, y: l.y, placeholder: true, i: i
    // };
    // Move the element to the dragged location.
    layout = moveElement(layout, l, x, y, true /* isUserAction */);
    // this.props.onDrag(layout, oldDragItem, l, placeholder, e, node);
    var newLayout = compact(layout, this.props.verticalCompact);
    this.setState({
      layout: newLayout,
      activeDrag: null
    });
    return newLayout;
  };

  PatchReactGridLayout.prototype.addGridOnDropPosition = function addGridOnDropPosition(pixelX, pixelY, i) {
    var _refs$gridItem$calcXY2 = this.refs.gridItem.calcXY(pixelY, pixelX),
        x = _refs$gridItem$calcXY2.x,
        y = _refs$gridItem$calcXY2.y;

    var layout = this.state.layout;

    var l = getLayoutItem(layout, i);
    debugger;
    if (!l) return;

    // Move the element here
    layout = moveElement(layout, l, x, y, true /* isUserAction */);

    // Set state
    var newLayout = compact(layout, this.props.verticalCompact);
    var oldLayout = this.state.oldLayout;

    this.setState({
      activeDrag: null,
      layout: newLayout,
      oldDragItem: null,
      oldLayout: null
    });
    this.onLayoutMaybeChanged(newLayout, oldLayout);
  };

  PatchReactGridLayout.prototype.calcXY = function calcXY(top, left, w, h) {
    var _props = this.props,
        margin = _props.margin,
        cols = _props.cols,
        rowHeight = _props.rowHeight,
        maxRows = _props.maxRows;

    var colWidth = this.calcColWidth();

    // left = colWidth * x + margin * (x + 1)
    // l = cx + m(x+1)
    // l = cx + mx + m
    // l - m = cx + mx
    // l - m = x(c + m)
    // (l - m) / (c + m) = x
    // x = (left - margin) / (coldWidth + margin)
    var x = Math.round((left - margin[0]) / (colWidth + margin[0]));
    var y = Math.round((top - margin[1]) / (rowHeight + margin[1]));

    // Capping
    x = Math.max(Math.min(x, cols - w), 0);
    y = Math.max(Math.min(y, maxRows - h), 0);
    return { x: x, y: y };
  };

  PatchReactGridLayout.prototype.calcColWidth = function calcColWidth() {
    var _props2 = this.props,
        margin = _props2.margin,
        width = _props2.width,
        cols = _props2.cols;

    var containerPadding = this.props.containerPadding || this.props.margin;
    return (width - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols;
  };

  PatchReactGridLayout.prototype.processGridItem = function processGridItem(child) {
    if (!child.key) return;
    var l = getLayoutItem(this.state.layout, child.key);
    if (!l) return null;
    var _props3 = this.props,
        width = _props3.width,
        cols = _props3.cols,
        margin = _props3.margin,
        containerPadding = _props3.containerPadding,
        rowHeight = _props3.rowHeight,
        maxRows = _props3.maxRows,
        isDraggable = _props3.isDraggable,
        isResizable = _props3.isResizable,
        useCSSTransforms = _props3.useCSSTransforms,
        draggableCancel = _props3.draggableCancel,
        draggableHandle = _props3.draggableHandle;
    var mounted = this.state.mounted;

    // Parse 'static'. Any properties defined directly on the grid item will take precedence.

    var draggable = Boolean(!l.static && isDraggable && (l.isDraggable || l.isDraggable == null));
    var resizable = Boolean(!l.static && isResizable && (l.isResizable || l.isResizable == null));
    return _react2.default.createElement(
      _GridItem2.default,
      {
        ref: "gridItem",
        containerWidth: width,
        cols: cols,
        margin: margin,
        containerPadding: containerPadding || margin,
        maxRows: maxRows,
        rowHeight: rowHeight,
        cancel: draggableCancel,
        handle: draggableHandle,
        onDragStop: this.onDragStop,
        onDragStart: this.onDragStart,
        onDrag: this.onDrag,
        onResizeStart: this.onResizeStart,
        onResize: this.onResize,
        onResizeStop: this.onResizeStop,
        isDraggable: draggable,
        isResizable: resizable,
        useCSSTransforms: useCSSTransforms && mounted,
        usePercentages: !mounted,
        w: l.w,
        h: l.h,
        x: l.x,
        y: l.y,
        i: l.i,
        minH: l.minH,
        minW: l.minW,
        maxH: l.maxH,
        maxW: l.maxW,
        'static': l.static
      },
      child
    );
  };

  PatchReactGridLayout.prototype.render = function render() {
    return _ReactGridLayout.prototype.render.call(this);
  };

  return PatchReactGridLayout;
}(_reactGridLayout2.default);

exports.default = PatchReactGridLayout;