// Generated by CoffeeScript 1.6.3
var Board, Bot, Circle, Drawable, FixedPole, Food, NeuralNet, Neuron, NeuronLayer, Square, Triangle, dist, dist2, mod, nn, painter, params, sigmoid, _ref, _ref1, _ref2, _ref3,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

sigmoid = function(netinput, response) {
  return 1 / (1 + Math.exp(-netinput / response));
};

params = {
  activationResponse: 1
};

Neuron = (function() {
  function Neuron(nInputs) {
    var i;
    this.nInputs = nInputs != null ? nInputs : 3;
    this.weights = (function() {
      var _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.nInputs; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(i / 10);
      }
      return _results;
    }).call(this);
  }

  Neuron.prototype.fire = function(input) {
    var i, out, value, _i, _len;
    out = 0;
    console.log(this.weights, input);
    console.assert(this.weights.length === input.length + 1);
    for (i = _i = 0, _len = input.length; _i < _len; i = ++_i) {
      value = input[i];
      console.log('\tvalue:', value, i, this.weights[i]);
      out += value * this.weights[i];
    }
    console.log('out:', out, sigmoid(out, params.activationResponse));
    return sigmoid(out, params.activationResponse);
  };

  return Neuron;

})();

NeuronLayer = (function() {
  NeuronLayer.prototype.nNeurons = 0;

  NeuronLayer.prototype.neurons = [];

  function NeuronLayer(nNeurons) {
    var i;
    if (nNeurons == null) {
      nNeurons = 3;
    }
    this.neurons = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= nNeurons ? _i < nNeurons : _i > nNeurons; i = 0 <= nNeurons ? ++_i : --_i) {
        _results.push(new Neuron);
      }
      return _results;
    })();
  }

  NeuronLayer.prototype.calculate = function(input) {
    var neuron, output, _i, _len, _ref;
    console.log('neuron layer:');
    output = [];
    _ref = this.neurons;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      neuron = _ref[_i];
      output.push(neuron.fire(input));
    }
    return output;
  };

  return NeuronLayer;

})();

NeuralNet = (function() {
  NeuralNet.prototype.nInputs = 0;

  NeuralNet.prototype.nOutputs = 0;

  NeuralNet.prototype.neuronsPerHiddenLayer = 0;

  NeuralNet.prototype.layers = [];

  function NeuralNet(layersConf) {
    var i, n;
    if (layersConf == null) {
      layersConf = null;
    }
    if (!layersConf) {
      this.layers = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 4; i = ++_i) {
          _results.push(new NeuronLayer);
        }
        return _results;
      })();
    } else if (typeof layersConf === 'number') {
      this.layers = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= nLayers ? _i < nLayers : _i > nLayers; i = 0 <= nLayers ? ++_i : --_i) {
          _results.push(new NeuronLayer);
        }
        return _results;
      })();
    } else {
      this.layers = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = layersConf.length; _i < _len; _i++) {
          n = layersConf[_i];
          _results.push(new NeuronLayer(n));
        }
        return _results;
      })();
    }
  }

  NeuralNet.prototype.getWeights = function() {};

  NeuralNet.prototype.getNumberOfWeights = function() {};

  NeuralNet.prototype.putWeights = function(weights) {};

  NeuralNet.prototype.update = function(inputNeurons) {
    var layer, outputs, _i, _len, _ref;
    console.log(this.layers);
    outputs = inputNeurons;
    _ref = this.layers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      layer = _ref[_i];
      outputs = layer.calculate(outputs);
    }
    return outputs;
  };

  return NeuralNet;

})();

nn = new NeuralNet;

console.log(nn.update([1, 0, 1]));

painter = {
  applyCanvasOptions: function(context, options) {
    if (options.fill === true) {
      return context.fillStyle = options.color || 'black';
    } else {
      context.strokeStyle = options.color || 'blue';
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

mod = function(a, n) {
  return ((a % n) + n) % n;
};

dist2 = function(a, b) {
  return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
};

dist = function(a, b) {
  return Math.sqrt(dist2(a, b));
};

Drawable = (function() {
  Drawable.prototype.type = 'Drawable';

  Drawable.prototype.multipliers = {};

  Drawable.prototype.angle = 0;

  Drawable.prototype.position = {
    x: 0,
    y: 0
  };

  Drawable.prototype.angularSpeed = 0;

  function Drawable(position) {
    this.position = position != null ? position : {
      x: Math.floor(Math.random() * canvas.width),
      y: Math.floor(Math.random() * canvas.height)
    };
    this.vel = {
      x: 0,
      y: 0
    };
    this.acc = {
      x: 0,
      y: 0
    };
    this.thrust = {
      a: .2,
      b: .2,
      c: .2,
      d: .2
    };
    this.angle = Math.random() * Math.PI * 2;
  }

  Drawable.prototype.render = function(context) {};

  Drawable.prototype.tic = function(step) {
    return this.angle += this.angularSpeed * step;
  };

  return Drawable;

})();

Circle = (function(_super) {
  __extends(Circle, _super);

  function Circle() {
    _ref = Circle.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Circle.prototype.render = function(context) {
    return painter.drawCircle(context, this.position, this.size, {
      color: this.color,
      fill: true
    });
  };

  return Circle;

})(Drawable);

Square = (function(_super) {
  __extends(Square, _super);

  function Square() {
    this.render = __bind(this.render, this);
    _ref1 = Square.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

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

Triangle = (function(_super) {
  __extends(Triangle, _super);

  function Triangle() {
    _ref2 = Triangle.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

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
      color: this.color,
      fill: true
    });
  };

  return Triangle;

})(Drawable);

Food = (function(_super) {
  __extends(Food, _super);

  Food.prototype.size = 5;

  Food.prototype.color = 'blue';

  function Food() {
    Food.__super__.constructor.apply(this, arguments);
    this.angularSpeed = Math.random() * 20 - 10;
  }

  Food.prototype.tic = function(step) {
    return this.angle += this.angularSpeed * step;
  };

  Food.prototype.eat = function(eater) {
    return this.position = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    };
  };

  return Food;

})(Triangle);

Bot = (function(_super) {
  __extends(Bot, _super);

  Bot.prototype.color = '#A2A';

  Bot.prototype.size = 10;

  Bot.closestFood = null;

  function Bot(position) {
    this.position = position;
    Bot.__super__.constructor.apply(this, arguments);
    window.lastAdded = this;
  }

  Bot.prototype.tic = function(step) {
    var food, nangle, speed, vel, _i, _len, _ref3;
    speed = 1500;
    this.position.x += speed * Math.cos(this.angle) * step;
    this.position.y += speed * Math.sin(this.angle) * step;
    this.position.x = mod(this.position.x, window.canvas.width);
    this.position.y = mod(this.position.y, window.canvas.height);
    this.closestFood = this.closestFood || game.board.food[0];
    _ref3 = game.board.food.slice(1);
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      food = _ref3[_i];
      if (dist2(this.position, food.position) < dist2(this.position, this.closestFood.position)) {
        this.closestFood.color = 'blue';
        this.closestFood = food;
      }
    }
    painter.drawLine(context, this.position, this.closestFood.position, {
      width: 1,
      color: 'grey'
    });
    this.closestFood.color = 'red';
    nangle = Math.atan2(this.closestFood.position.y - this.position.y, this.closestFood.position.x - this.position.x);
    vel = (nangle - this.angle) / 5;
    this.angle = nangle;
    if (dist2(this.position, this.closestFood.position) < Math.pow(this.size + food.size, 2)) {
      this.closestFood.eat(this);
    }
    if (window.leftPressed) {
      this.angle += 0.2;
    }
    if (window.rightPressed) {
      return this.angle -= 0.2;
    }
  };

  Bot.prototype.render = function(context) {
    var a, angles, t;
    Bot.__super__.render.apply(this, arguments);
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
    painter.drawCenteredPolygon(context, this.position, [this.p1, this.p2, this.p3], this.angle, {
      color: 'white',
      fill: true
    });
    context.lineWidth = this.size - 6;
    angles = {
      a: [Math.PI, Math.PI * 3 / 2],
      d: [Math.PI / 2, Math.PI],
      c: [0, Math.PI / 2],
      b: [Math.PI * 3 / 2, 0]
    };
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    for (t in angles) {
      a = angles[t];
      context.beginPath();
      context.strokeStyle = "rgba(0,0,0," + this.thrust[t] + ")";
      context.arc(0, 0, this.size / 2 + 6, a[0], a[1]);
      context.stroke();
    }
    return context.restore();
  };

  return Bot;

})(Circle);

FixedPole = (function(_super) {
  __extends(FixedPole, _super);

  function FixedPole() {
    _ref3 = FixedPole.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  FixedPole.prototype.color = 'grey';

  FixedPole.prototype.size = 70;

  FixedPole.prototype.tic = function(step) {
    return FixedPole.__super__.tic.apply(this, arguments);
  };

  return FixedPole;

})(Circle);

Board = (function() {
  Board.prototype.addObject = function(object) {
    return this.state.push(object);
  };

  Board.prototype.addBot = function(object) {
    return this.bots.push(object);
  };

  Board.prototype.addFood = function(object) {
    return this.food.push(object);
  };

  function Board(canvas) {
    var i, name, vars, _fn, _i, _j, _len;
    this.canvas = canvas;
    window.context = this.canvas.getContext("2d");
    window.frame = 0;
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
    this.bots = [];
    this.food = [];
    window.lastAdded = null;
    for (i = _j = 0; _j <= 50; i = ++_j) {
      this.addFood(new Food());
    }
  }

  Board.prototype.render = function(context) {
    var item, _i, _j, _k, _len, _len1, _len2, _ref4, _ref5, _ref6, _results;
    _ref4 = this.state;
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      item = _ref4[_i];
      item.render(context);
    }
    _ref5 = this.food;
    for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
      item = _ref5[_j];
      item.render(context);
    }
    _ref6 = this.bots;
    _results = [];
    for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
      item = _ref6[_k];
      _results.push(item.render(context));
    }
    return _results;
  };

  Board.prototype.tic = function(step) {
    var item, _i, _j, _k, _len, _len1, _len2, _ref4, _ref5, _ref6, _results;
    window.frame++;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    _ref4 = this.food;
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      item = _ref4[_i];
      item.tic(step);
    }
    _ref5 = this.bots;
    for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
      item = _ref5[_j];
      item.tic(step);
    }
    _ref6 = this.state;
    _results = [];
    for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
      item = _ref6[_k];
      _results.push(item.tic(step));
    }
    return _results;
  };

  return Board;

})();
