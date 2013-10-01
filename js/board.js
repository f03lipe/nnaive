// Generated by CoffeeScript 1.6.3
var Board, Bot, Circle, Drawable, FixedPole, Square, Triangle, getResultant, mm, painter, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

painter = {
  applyCanvasOptions: function(context, options) {
    if (options.fill === true) {
      if ('color' in options) {
        return context.fillStyle = options.color;
      }
    } else {
      if ('color' in options) {
        context.strokeStyle = options.color;
      }
      return context.lineWidth = options.width || 1;
    }
  },
  drawCircle: function(context, position, radius, options) {
    if (radius == null) {
      radius = 2;
    }
    if (options == null) {
      options = {};
    }
    this.applyCanvasOptions(context, options);
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, 2 * Math.PI, true);
    if (options.fill) {
      return context.fill();
    } else {
      return context.stroke();
    }
  },
  drawLine: function(context, p1, p2, options) {
    if (options == null) {
      options = {};
    }
    this.applyCanvasOptions(context, options);
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    return context.stroke();
  },
  drawTriangle: function(context, p1, p2, p3, options) {
    if (options == null) {
      options = {};
    }
    this.applyCanvasOptions(context, options);
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.closePath();
    return context.stroke();
  },
  drawCenteredPolygon: function(context, center, points, angle, options) {
    var point, _i, _len, _ref;
    if (angle == null) {
      angle = 0;
    }
    if (options == null) {
      options = {};
    }
    this.applyCanvasOptions(context, options);
    context.save();
    context.translate(center.x, center.y);
    context.rotate(angle);
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    _ref = points.slice(1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      point = _ref[_i];
      context.lineTo(point.x, point.y);
    }
    context.closePath();
    if (options.fill) {
      context.fill();
    } else {
      context.stroke();
    }
    return context.restore();
  },
  drawPolygon: function(context, points, options) {
    var point, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    this.applyCanvasOptions(context, options);
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    _ref = points.slice(1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      point = _ref[_i];
      context.lineTo(point.x, point.y);
    }
    context.lineTo(points[0].x, points[0].y);
    context.closePath();
    if (options.fill) {
      return context.fill();
    } else {
      return context.stroke;
    }
  },
  drawRectangle: function(context, p1, p2, angle, options) {
    if (angle == null) {
      angle = 0;
    }
    if (options == null) {
      options = {};
    }
    this.applyCanvasOptions(context, options);
    context.beginPath();
    if (angle !== 0) {
      context.save();
      context.translate((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      context.rotate(angle);
      context.rect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
      context.restore();
    } else {
      context.rect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    }
    if (options.fill) {
      return context.fill();
    } else {
      return context.stroke();
    }
  },
  drawSizedRect: function(context, point, size, angle, options) {
    if (angle == null) {
      angle = 0;
    }
    if (options == null) {
      options = {};
    }
    this.applyCanvasOptions(context, options);
    context.beginPath();
    if (angle) {
      context.save();
      context.translate(point.x, point.y);
      context.rotate(angle);
      context.rect(-size.x / 2, -size.y / 2, size.x, size.y);
      context.restore();
    } else {
      context.rect(point.x - size.x / 2, point.y - size.y / 2, size.x, size.y);
    }
    if (options.fill) {
      return context.fill();
    } else {
      return context.stroke();
    }
  }
};

mm = function(min, num, max) {
  return Math.max(min, Math.min(max, num));
};

getResultant = function(m, objects, distDecay, reppel) {
  var F, alpha, d2, dfx, dfy, dx, dy, fx, fy, multiplier, obj, rx, ry, _i, _len;
  if (distDecay == null) {
    distDecay = 2;
  }
  if (reppel == null) {
    reppel = 2;
  }
  fx = fy = 0;
  for (_i = 0, _len = objects.length; _i < _len; _i++) {
    obj = objects[_i];
    if (!(obj !== m)) {
      continue;
    }
    dx = m.position.x - obj.position.x;
    dy = m.position.y - obj.position.y;
    rx = dx > 0 ? -1 : 1;
    ry = dy > 0 ? -1 : 1;
    d2 = Math.pow(m.position.x - obj.position.x, 2) + Math.pow(m.position.y - obj.position.y, 2);
    F = 1 / (distDecay === 2 ? d2 : Math.pow(d2, distDecay / 2));
    alpha = Math.atan(dy / dx);
    dfx = Math.abs(Math.cos(alpha)) * F * rx;
    dfy = Math.abs(Math.sin(alpha)) * F * ry;
    painter.drawLine(context, m.position, obj.position, {
      color: "grey",
      width: mm(0, F * 5000, 200)
    });
    multiplier = m.getMultiplier(obj);
    if (d2 < Math.pow(obj.size + m.size, 2)) {
      fx += -Math.pow(reppel, distDecay) * dfx;
      fy += -Math.pow(reppel, distDecay) * dfy;
    } else {
      fx += dfx * multiplier;
      fy += dfy * multiplier;
    }
  }
  painter.drawLine(context, m.position, {
    x: m.position.x + fx * Math.pow(5000, distDecay),
    y: m.position.y + fy * Math.pow(5000, distDecay)
  }, {
    color: "red"
  });
  return {
    x: fx,
    y: fy,
    angle: (fx ? Math.atan(fy / fx) : 0) + (fx < 0 ? Math.PI : 0)
  };
};

Drawable = (function() {
  Drawable.prototype.type = 'Drawable';

  Drawable.prototype.multipliers = {};

  Drawable.prototype.mass = 1;

  Drawable.prototype.angle = 0;

  Drawable.prototype.position = {
    x: 0,
    y: 0
  };

  Drawable.prototype.angularSpeed = 0;

  function Drawable(position) {
    this.position = position;
    this.vel = {
      x: 0,
      y: 0
    };
    this.acc = {
      x: 0,
      y: 0
    };
    this.twalk = 0;
    this.angle = Math.random() * Math.PI * 2;
    this.defineWalk();
    this.factor = {
      x: Math.random() > (typeof 0.5 === "function" ? 0.5({
        1: -1,
        y: Math.random() > (typeof 0.5 === "function" ? 0.5({
          1: -1
        }) : void 0)
      }) : void 0)
    };
  }

  Drawable.prototype.getMultiplier = function(obj) {
    if (obj.type in this.multipliers) {
      return this.multipliers[obj.type];
    }
    return 1;
  };

  Drawable.prototype.defineWalk = function() {
    var max;
    console.log('Defining twalk.');
    max = 0.05;
    this.vel.x = max * Math.random() - max / 2;
    this.vel.y = max * Math.random() - max / 2;
    this.angularSpeed *= (this.vel.x < 0 ? -1 : 1);
    this.twalk = Math.max(50, Math.floor(500 * Math.random()));
    return this.angle = 2;
  };

  Drawable.prototype.tic = function(step) {
    var wholevel;
    step = window.vars.step;
    this._acc = {
      x: this.acc.x,
      y: this.acc.y
    };
    this.position.x += this.vel.x * step + (0.5 * this._acc.x * step * step);
    this.position.y += this.vel.y * step + (0.5 * this._acc.y * step * step);
    this.acc = getResultant(this, game.board.state, 3);
    this.acc.x *= 1 / this.mass;
    this.acc.y *= 1 / this.mass;
    this.vel.x += (this._acc.x + this.acc.x) / 2 * step * window.vars.rest / 100;
    this.vel.y += (this._acc.y + this.acc.y) / 2 * step * window.vars.rest / 100;
    wholevel = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    this.vel.x = 1 * this.vel.x + 0.01 * wholevel * Math.cos(this.angle);
    this.vel.y = 1 * this.vel.y + 0.01 * wholevel * Math.sin(this.angle);
    if (!this.twalk--) {
      this.defineWalk();
    }
    this.angle += (this.acc.angle - this.angle) * .01;
    if (canvas.height - this.position.y < 10 || this.position.y < 10) {
      this.vel.y *= -0.5;
    }
    if (canvas.width - this.position.x < 10 || this.position.x < 10) {
      this.vel.x *= -0.5;
    }
    this.position.x = mm(0, this.position.x, window.canvas.width);
    return this.position.y = mm(0, this.position.y, window.canvas.height);
  };

  Drawable.prototype.render = function(context) {};

  return Drawable;

})();

Triangle = (function(_super) {
  __extends(Triangle, _super);

  function Triangle(position) {
    this.position = position;
  }

  Triangle.prototype.tic = function(step) {};

  Triangle.prototype.render = function(context) {
    this.p1 = {
      x: 0,
      y: -1.154700 * this.size
    };
    this.p2 = {
      x: -this.size,
      y: 0.5773 * this.size
    };
    this.p3 = {
      x: this.size,
      y: 0.5773 * this.size
    };
    return painter.drawCenteredPolygon(context, this.position, [this.p1, this.p2, this.p3], this.angle, {
      color: this.color
    });
  };

  return Triangle;

})(Drawable);

Circle = (function(_super) {
  __extends(Circle, _super);

  function Circle() {
    _ref = Circle.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Circle.prototype.color = "black";

  Circle.prototype.size = 10;

  Circle.prototype.render = function(context) {
    painter.drawCircle(context, this.position, this.size, {
      color: '#AD0',
      fill: true
    });
    this.p1 = {
      x: this.size / 2,
      y: 0
    };
    this.p2 = {
      x: -this.size * 2 / 3,
      y: this.size / 3
    };
    this.p3 = {
      x: -this.size * 2 / 3,
      y: -this.size / 3
    };
    return painter.drawCenteredPolygon(context, this.position, [this.p1, this.p2, this.p3], this.angle, {
      color: 'black',
      fill: true
    });
  };

  return Circle;

})(Drawable);

window.lastAdded = null;

Square = (function(_super) {
  __extends(Square, _super);

  function Square() {
    this.render = __bind(this.render, this);
    _ref1 = Square.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Square.prototype.color = "black";

  Square.prototype.size = 15;

  Square.prototype.render = function(context) {
    return painter.drawSizedRect(context, this.position, {
      x: this.size,
      y: this.size
    }, this.angle, {
      color: this.color,
      fill: true
    });
  };

  return Square;

})(Drawable);

Bot = (function(_super) {
  __extends(Bot, _super);

  Bot.prototype.type = 'Bot';

  Bot.prototype.color = '#A2A';

  Bot.prototype.multipliers = {
    'Bot': 0.01,
    'FixedPole': .5
  };

  Bot.prototype.size = 20;

  Bot.prototype.angularSpeed = .00001;

  function Bot(position) {
    this.position = position;
    Bot.__super__.constructor.apply(this, arguments);
    window.lastAdded = this;
  }

  Bot.prototype.tic = function(step) {
    Bot.__super__.tic.apply(this, arguments);
    if (this === window.lastAdded) {
      return console.log;
    }
  };

  return Bot;

})(Circle);

FixedPole = (function(_super) {
  __extends(FixedPole, _super);

  function FixedPole() {
    _ref2 = FixedPole.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  FixedPole.prototype.type = 'FixedPole';

  FixedPole.prototype.color = "#08e";

  FixedPole.prototype.size = 30;

  FixedPole.prototype.angularSpeed = .0002;

  FixedPole.prototype.tic = function(step) {
    step = 20;
    this.size = window.vars.polesize;
    return this.angle += this.angularSpeed * step;
  };

  return FixedPole;

})(Triangle);

Board = (function() {
  Board.prototype.addObject = function(object) {
    return this.state.push(object);
  };

  function Board(canvas) {
    var name, vars, _fn, _i, _len;
    this.canvas = canvas;
    window.context = this.canvas.getContext("2d");
    window.vars = {};
    vars = _.map($(".control"), function(i) {
      return i.id;
    });
    _fn = function() {
      var n,
        _this = this;
      n = name;
      return $(".control#" + name + " input").bind('change', function(event) {
        var value;
        window.e = event;
        value = Math.max(0.1, parseInt(event.target.value) / parseInt(event.target.dataset.divisor || 1));
        event.target.parentElement.querySelector('span').innerHTML = value;
        return window.vars[n] = value;
      });
    };
    for (_i = 0, _len = vars.length; _i < _len; _i++) {
      name = vars[_i];
      window.vars[name] = parseInt($(".control#" + name + " input").attr('value'));
      _fn();
    }
    this.state = [];
  }

  Board.prototype.render = function(context) {
    var item, _i, _len, _ref3, _results;
    _ref3 = this.state;
    _results = [];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      item = _ref3[_i];
      _results.push(item.render(context));
    }
    return _results;
  };

  Board.prototype.tic = function(step) {
    var item, _i, _len, _ref3, _results;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    _ref3 = this.state;
    _results = [];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      item = _ref3[_i];
      _results.push(item.tic(step));
    }
    return _results;
  };

  return Board;

})();
