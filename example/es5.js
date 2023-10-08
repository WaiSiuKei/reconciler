var _marked = /*#__PURE__*/regeneratorRuntime.mark(example);
function example() {
  var a;
  return regeneratorRuntime.wrap(function example$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        a = 1;
        _context.next = 3;
        return a++;
      case 3:
        _context.next = 5;
        return a++;
      case 5:
        _context.next = 7;
        return a++;
      case 7:
      case "end":
        return _context.stop();
    }
  }, _marked);
}
var iter = example();
iter.next();
