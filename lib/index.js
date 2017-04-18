'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _SizeAndPositionManager = require('./SizeAndPositionManager');

var _SizeAndPositionManager2 = _interopRequireDefault(_SizeAndPositionManager);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLE_WRAPPER = { overflow: 'auto', willChange: 'transform', WebkitOverflowScrolling: 'touch' };
var STYLE_INNER = { position: 'relative', overflow: 'hidden', width: '100%', minHeight: '100%' };
var STYLE_ITEM = { position: 'absolute', left: 0, width: '100%' };

var VirtualList = (_temp2 = _class = function (_PureComponent) {
  _inherits(VirtualList, _PureComponent);

  function VirtualList() {
    var _temp, _this, _ret;

    _classCallCheck(this, VirtualList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _PureComponent.call.apply(_PureComponent, [this].concat(args))), _this), _this.sizeAndPositionManager = new _SizeAndPositionManager2.default({
      itemCount: _this.props.itemCount,
      itemSizeGetter: function itemSizeGetter(_ref) {
        var index = _ref.index;
        return _this.getSize(index);
      },
      estimatedItemSize: _this.getEstimatedItemSize()
    }), _this.state = {
      offset: _this.props.scrollOffset || _this.props.scrollToIndex != null && _this.getOffsetForIndex(_this.props.scrollToIndex) || 0
    }, _this._styleCache = {}, _this._getRef = function (node) {
      _this.rootNode = node;
    }, _this.handleScroll = function (e) {
      var onScroll = _this.props.onScroll;

      var offset = _this.getNodeOffset();

      _this.setState({ offset: offset });

      if (typeof onScroll === 'function') {
        onScroll(offset, e);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  VirtualList.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props,
        scrollOffset = _props.scrollOffset,
        scrollToIndex = _props.scrollToIndex;


    if (scrollOffset != null) {
      this.scrollTo(scrollOffset);
    } else if (scrollToIndex != null) {
      this.scrollTo(this.getOffsetForIndex(scrollToIndex));
    }
  };

  VirtualList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _props2 = this.props,
        estimatedItemSize = _props2.estimatedItemSize,
        itemCount = _props2.itemCount,
        itemSize = _props2.itemSize,
        scrollOffset = _props2.scrollOffset,
        scrollToAlignment = _props2.scrollToAlignment,
        scrollToIndex = _props2.scrollToIndex,
        scrollOnItemChange = _props2.scrollOnItemChange;

    var scrollPropsHaveChanged = nextProps.scrollToIndex !== scrollToIndex || nextProps.scrollToAlignment !== scrollToAlignment;
    var itemPropsHaveChanged = nextProps.itemCount !== itemCount || nextProps.itemSize !== itemSize || nextProps.estimatedItemSize !== estimatedItemSize;

    if (nextProps.itemCount !== itemCount || nextProps.estimatedItemSize !== estimatedItemSize) {
      this.sizeAndPositionManager.updateConfig({
        itemCount: nextProps.itemCount,
        estimatedItemSize: this.getEstimatedItemSize(nextProps)
      });
    }

    if (itemPropsHaveChanged) {
      this.recomputeSizes();
    }

    if (nextProps.scrollOffset !== scrollOffset) {
      this.setState({
        offset: nextProps.scrollOffset
      });
    } else if (scrollPropsHaveChanged || (scrollOnItemChange || nextProps.scrollToIndex) && itemPropsHaveChanged) {
      this.setState({
        offset: this.getOffsetForIndex(nextProps.scrollToIndex, nextProps.scrollToAlignment, nextProps.itemCount)
      });
    }
  };

  VirtualList.prototype.componentDidUpdate = function componentDidUpdate(nextProps, nextState) {
    var offset = this.state.offset;


    if (nextState.offset !== offset) {
      this.scrollTo(offset);
    }
  };

  VirtualList.prototype.getEstimatedItemSize = function getEstimatedItemSize() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    return props.estimatedItemSize || typeof props.itemSize === "number" && props.itemSize || 50;
  };

  VirtualList.prototype.getNodeOffset = function getNodeOffset() {
    var scrollDirection = this.props.scrollDirection;

    return this.rootNode[_constants.scrollProp[scrollDirection]];
  };

  VirtualList.prototype.scrollTo = function scrollTo(value) {
    var scrollDirection = this.props.scrollDirection;

    this.rootNode[_constants.scrollProp[scrollDirection]] = value;
  };

  VirtualList.prototype.getOffsetForIndex = function getOffsetForIndex(index) {
    var scrollToAlignment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.scrollToAlignment;
    var itemCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props.itemCount;
    var scrollDirection = this.props.scrollDirection;


    if (index < 0 || index >= itemCount) {
      index = 0;
    }

    return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
      align: scrollToAlignment,
      containerSize: this.props[_constants.sizeProp[scrollDirection]],
      targetIndex: index
    });
  };

  VirtualList.prototype.getSize = function getSize(index) {
    var itemSize = this.props.itemSize;


    if (typeof itemSize === 'function') {
      return itemSize(index);
    }

    return Array.isArray(itemSize) ? itemSize[index] : itemSize;
  };

  VirtualList.prototype.getStyle = function getStyle(index) {
    var _extends2;

    var style = this._styleCache[index];
    if (style) {
      return style;
    }

    var scrollDirection = this.props.scrollDirection;

    var _sizeAndPositionManag = this.sizeAndPositionManager.getSizeAndPositionForIndex(index),
        size = _sizeAndPositionManag.size,
        offset = _sizeAndPositionManag.offset;

    return this._styleCache[index] = _extends({}, STYLE_ITEM, (_extends2 = {}, _extends2[_constants.sizeProp[scrollDirection]] = size, _extends2[_constants.positionProp[scrollDirection]] = offset, _extends2));
  };

  VirtualList.prototype.recomputeSizes = function recomputeSizes() {
    var startIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    this._styleCache = {};
    this.sizeAndPositionManager.resetItem(startIndex);
  };

  VirtualList.prototype.render = function render() {
    var _extends3;

    /* eslint-disable no-unused-vars */
    var _props3 = this.props,
        estimatedItemSize = _props3.estimatedItemSize,
        height = _props3.height,
        overscanCount = _props3.overscanCount,
        renderItem = _props3.renderItem,
        itemCount = _props3.itemCount,
        itemSize = _props3.itemSize,
        scrollDirection = _props3.scrollDirection,
        scrollOffset = _props3.scrollOffset,
        scrollToIndex = _props3.scrollToIndex,
        scrollToAlignment = _props3.scrollToAlignment,
        style = _props3.style,
        width = _props3.width,
        props = _objectWithoutProperties(_props3, ['estimatedItemSize', 'height', 'overscanCount', 'renderItem', 'itemCount', 'itemSize', 'scrollDirection', 'scrollOffset', 'scrollToIndex', 'scrollToAlignment', 'style', 'width']);

    var offset = this.state.offset;

    var _sizeAndPositionManag2 = this.sizeAndPositionManager.getVisibleRange({
      containerSize: this.props[_constants.sizeProp[scrollDirection]],
      offset: offset,
      overscanCount: overscanCount
    }),
        start = _sizeAndPositionManag2.start,
        stop = _sizeAndPositionManag2.stop;

    var items = [];

    for (var index = start; index <= stop; index++) {
      items.push(renderItem({
        index: index,
        style: this.getStyle(index)
      }));
    }

    return _react2.default.createElement(
      'div',
      _extends({ ref: this._getRef }, props, { onScroll: this.handleScroll, style: _extends({}, STYLE_WRAPPER, style, { height: height, width: width }) }),
      _react2.default.createElement(
        'div',
        { style: _extends({}, STYLE_INNER, (_extends3 = {}, _extends3[_constants.sizeProp[scrollDirection]] = this.sizeAndPositionManager.getTotalSize(), _extends3)) },
        items
      )
    );
  };

  return VirtualList;
}(_react.PureComponent), _class.defaultProps = {
  overscanCount: 3,
  scrollDirection: _constants.DIRECTION_VERTICAL,
  width: '100%',
  scrollOnItemChange: false
}, _temp2);
exports.default = VirtualList;
process.env.NODE_ENV !== "production" ? VirtualList.propTypes = {
  estimatedItemSize: _propTypes2.default.number,
  height: _propTypes2.default.number.isRequired,
  itemCount: _propTypes2.default.number.isRequired,
  itemSize: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.array, _propTypes2.default.func]).isRequired,
  overscanCount: _propTypes2.default.number,
  renderItem: _propTypes2.default.func.isRequired,
  scrollOffset: _propTypes2.default.number,
  scrollToIndex: _propTypes2.default.number,
  scrollToAlignment: _propTypes2.default.oneOf([_constants.ALIGN_START, _constants.ALIGN_CENTER, _constants.ALIGN_END]),
  scrollDirection: _propTypes2.default.oneOf([_constants.DIRECTION_HORIZONTAL, _constants.DIRECTION_VERTICAL]).isRequired,
  width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  scrollOnItemChange: _propTypes2.default.bool
} : void 0;
module.exports = exports['default'];