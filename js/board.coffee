
# board.coffee for nnaive

painter =
	applyCanvasOptions : (context, options) ->
		if options.fill is true
			context.fillStyle = options.color or 'black'
		else
			context.strokeStyle = options.color or 'blue'
			context.lineWidth = options.width or 1

	###### Canvas manipulation functions

	drawCircle : (context, position, radius=2, options={}) ->
		this.applyCanvasOptions(context, options)
		context.beginPath()
		context.arc(position.x, position.y, radius, 0, 2*Math.PI, true)
		if options.fill
			context.fill()
		else context.stroke()

	drawLine : (context, p1, p2, options={}) ->
		this.applyCanvasOptions(context, options)
		context.beginPath()
		context.moveTo(p1.x, p1.y)
		context.lineTo(p2.x, p2.y)
		context.stroke()

	drawTriangle : (context, p1, p2, p3, options={}) ->
		this.applyCanvasOptions(context, options)
		context.beginPath()
		context.moveTo(p1.x, p1.y)
		context.lineTo(p2.x, p2.y)
		context.lineTo(p3.x, p3.y)
		context.closePath()
		context.stroke()

	drawCenteredPolygon : (context, center, points, angle=0, options={}) ->
		this.applyCanvasOptions(context, options)
		context.save()
		context.translate(center.x, center.y)
		context.rotate(angle)
		context.beginPath()
		context.moveTo(points[0].x, points[0].y)
		for point in points[1..]
			context.lineTo(point.x,point.y)
		context.closePath()
		if options.fill
			context.fill()
		else context.stroke()
		context.restore()

	# Draws a polygon.
	# Won't take angle arg, because it is necessary to have the rotation center.
	# For that, use drawCenteredPolygo
	drawPolygon : (context, points, options={}) ->
		this.applyCanvasOptions(context, options)
		context.beginPath()
		context.moveTo(points[0].x, points[0].y)
		for point in points[1..]
			context.lineTo(point.x,point.y)
		context.lineTo(points[0].x, points[0].y)
		context.closePath()
		if options.fill
			context.fill()
		else context.stroke

	# Fills a rectangle between two points.
	drawRectangle : (context, p1, p2, angle=0, options={}) ->
		this.applyCanvasOptions(context, options)
		context.beginPath()
		if angle isnt 0
			context.save()
			context.translate((p1.x+p2.x)/2, (p1.y+p2.y)/2) # Translate center of canvas to center of figure.
			context.rotate(angle)
			context.rect(p1.x, p1.y, p2.x-p1.x, p2.y-p1.y)
			context.restore()
		else
			context.rect(p1.x, p1.y, p2.x-p1.x, p2.y-p1.y)
		if options.fill
			context.fill()
		else context.stroke()

	# Draws a rectangle using the center and size (x:width,y:height) as paramenters. 
	drawSizedRect : (context, point, size, angle=0, options={}) ->
		this.applyCanvasOptions(context, options)
		context.beginPath()
		if angle
			context.save()
			context.translate(point.x, point.y) # Translate center of canvas to center of figure.
			context.rotate(angle)
			context.rect(-size.x/2, -size.y/2, size.x, size.y)
			context.restore()
		else
			context.rect(point.x-size.x/2, point.y-size.y/2, size.x, size.y)
		if options.fill
			context.fill()
		else context.stroke()

################################################################################
################################################################################

mod  = (a,n) -> ((a%n)+n)%n
dist2= (a,b) -> Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)
dist = (a,b) -> Math.sqrt(dist2(a,b))

class Drawable
	type: 'Drawable'
	multipliers: {}
	angle: 0
	position: {x:0, y:0}
	angularSpeed: 0
	
	constructor: (@position=\
			{x:Math.floor(Math.random()*canvas.width),\
			y:Math.floor(Math.random()*canvas.height)}) ->
		@vel = {x:0, y:0}
		@acc = {x:0, y:0}
		@thrust = {a:.2,b:.2,c:.2,d:.2}
		@angle = Math.random()*Math.PI*2

	render: (context) ->
	
	tic: (step) -> 
		@angle += @angularSpeed * step

class Circle extends Drawable

	render: (context) ->
		painter.drawCircle(context, @position, @size, {color:@color, fill:true})

class Square extends Drawable

	render: (context) =>
		painter.drawSizedRect(context, @position, {x:@size,y:@size}, @angle, {color:@color, fill:true})

class Triangle extends Drawable

	render: (context) ->
		@p1 = {x: 0, y: -1.154700*@size}
		@p2 = {x: -@size, y: 0.5773*@size}
		@p3 = {x: @size, y: 0.5773*@size}
		painter.drawCenteredPolygon(context, @position, [@p1,@p2,@p3], @angle, {color:@color, fill:true})

class Food extends Triangle

	size: 5
	color: 'blue'

	constructor: ->
		super
		@angularSpeed = Math.random()*20-10

	tic: (step) ->
		@angle += @angularSpeed * step

	eat: (eater) -> # reset position.
		@position = 
			x: Math.random()*canvas.width,
			y: Math.random()*canvas.height

class _Bot extends Circle
	
	color: '#A2A'
	size: 10
	@closestFood = null

	constructor: (@position) ->
		super
		window.lastAdded = @

	tic: (step) ->

		speed = 100
		@position.x += speed*Math.cos(@angle)*step # *(@_acc.x*step*step/2)
		@position.y += speed*Math.sin(@angle)*step # *(@_acc.y*step*step/2)

		# Limit particle to canvas bounds.
		@position.x = mod(@position.x,window.canvas.width)
		@position.y = mod(@position.y,window.canvas.height)

		@closestFood = @closestFood or game.board.food[0]
		for food in game.board.food[1..]
			if dist2(@position,food.position) < dist2(@position,@closestFood.position)
				@closestFood.color = 'blue'
				@closestFood = food
		painter.drawLine(context, @position, @closestFood.position, {width: 1, color: 'grey'})
		@closestFood.color = 'red'

		output = @nn.update([@closestFood.position.x-@position.x,@closestFood.position.y-@position.y,\
				Math.cos(@angle), Math.sin(@angle)])
		# console.log('output', output)
		nangle = output[0]-output[1]
		#nangle = Math.atan2(@closestFood.position.y-@position.y, @closestFood.position.x-@position.x)
		# vel = (nangle-@angle)/5
		@angle += nangle

		if window.leftPressed then @angle += 0.2
		if window.rightPressed then @angle -= 0.2
		
	render: (context) ->
		super
		@p1 = {x: @size/2, y: 0}
		@p2 = {x: -@size*2/3, y: @size/3}
		@p3 = {x: -@size*2/3, y: -@size/3}

		painter.drawCircle(context, @position, @size+@fitness*4, {color: 'rgba(0,0,0,.4)'})
		painter.drawCenteredPolygon(context, @position, [@p1,@p2,@p3], @angle, {color:'white', fill:true})

		# context.lineWidth = @size-6
		# angles = {a:[Math.PI, Math.PI*3/2], d:[Math.PI/2, Math.PI], c:[0, Math.PI/2], b:[Math.PI*3/2, 0]}
		# context.save()
		# context.translate(@position.x, @position.y)
		# context.rotate(@angle)
		# for t, a of angles
		# 	context.beginPath()
		# 	context.strokeStyle = "rgba(0,0,0,#{@thrust[t]})"
		# 	context.arc(0, 0, @size/2+6, a[0], a[1]);
		# 	context.stroke()
		# context.restore()

	foundFood: ->
		if dist2(@position,@closestFood.position) < Math.pow(@size+@closestFood.size,2)
			@closestFood.eat(@)
			return yes
		return no

class FixedPole extends Circle
	
	color: 'grey'
	size: 70

	tic: (step) ->
		super

################################################################################
################################################################################


sigmoid = (netinput, response) -> 1/(1+Math.exp(-netinput/response))

parameters =
	activationResponse: 1 								# for the sigmoid function
	numTics: 500										# num of tics per generation
	popSize: 30
	crossoverRate: 0.7
	mutationRate: 0.3 # down to 0.05
	foodCount: 40

class Neuron
	
	constructor: (@nInputs=window.NPL) ->
		# Notice we're deliberately chosing to go for a nInputs+1 sized @weights
		# array, leaving space for the last item to be the bias weight.
		@weights = (0 for i in [0..@nInputs]) # Initialize to 0.

	fire: (input) ->
		out = 0
		console.assert(@weights.length is input.length+1)
		for value, i in input
			out += value*@weights[i]
		out += -1*@weights[@weights.length-1]
		return sigmoid(out, parameters.activationResponse)

	getWeights: -> @weights
	putWeights: (weights) -> @weights = weights.splice(0,@nInputs+1) # +1 for bias

class NeuronLayer
	neurons: []
	
	constructor: (nNeurons=window.NPL) ->
		@neurons = (new Neuron for i in [0...nNeurons])

	calculate: (input) ->
		output = []
		for neuron in @neurons
			output.push(neuron.fire(input))
		return output

	getWeights: -> _.flatten((neuron.getWeights() for neuron in @neurons))
	putWeights: (weights) ->
		for neuron in @neurons
			neuron.putWeights(weights)

class NeuralNet
	layers: []

	constructor: (layersConf=null) ->
		if not layersConf
			@layers = (new NeuronLayer for i in [0...window.NL])
		else if typeof layersConf is 'number'
			@layers = (new NeuronLayer for i in [0...nLayers])
		else # layersConf is Array
			@layers = (new NeuronLayer(n) for n in layersConf)
	
	getWeights: -> _.flatten((layer.getWeights() for layer in @layers))	
	putWeights: (weights) ->
		# I'm setting these to work like streams: each neuron splices a bit of it.
		_weights = weights[..] # Make a copy just in case.
		for layer in @layers
			layer.putWeights(_weights)
	
	update: (inputNeurons) ->
		# console.log(@layers)
		outputs = inputNeurons
		for layer in @layers
			outputs = layer.calculate(outputs)
		return outputs


class GeneticEngine
	population = [] # Holds all SGenoma
	totalFitness = 0
	bestFitness = 0
	avgFitness = 0
	worstFitness = 0
	bestGenoma = null
	# mutationRate = 0.3 # to 0.05
	# crossoverRate = 0.9
	genCounter = 0

	# constructor: (popSize) ->
	# 	#for 

	crossover = (mum, dad) ->
		if mum is dad or parameters.crossoverRate < Math.random()
			return [mum[..], dad[..]]
		baby1 = []
		baby2 = []
		cp = Math.floor(Math.random()*mum.length)
		for i in [0...cp]
			baby1.push(mum[i])
			baby2.push(dad[i])
		for i in [cp...mum.length]
			baby1.push(dad[i])
			baby2.push(mum[i])
		console.log('baby1', baby1, 'baby2', baby2)
		return [baby1, baby2]

	mutate = (a) -> a

	# Returns a random chromossome. (?)
	getChromoRoulette: (population) ->
		slice = Math.random()*_.reduce(_.pluck(population, 'fitness'),((a,b)->a+b))
		fitnessCount = 0
		for g in population
			fitnessCount += g.fitness
			if fitnessCount >= slice
				return g
		console.log('não', _.reduce(population,(a,b)->a.fitness+b.fitness), population)

	# calculateBestWorstAvgTotal: ->

	makeNew: (popSize, numWeights) ->
		pop = []
		for i in [0...popSize]
			pop.push(new Bot(((Math.random()-Math.random()) for i2 in [0...numWeights])))
		return pop

	reset: ->

	epoch: (oldpop) ->
		sorted = _.sortBy(oldpop, (a) -> a.fitness);
		newpop = []
		# Push elite (5 best members) to new population. Survive!
		for g in sorted[sorted.length-5..] # Use parameters.
			g.reset()
			newpop.push(g)
			g.isTop = true
		# Generate until population cap is reached.
		while newpop.length < parameters.popSize
			mother = @getChromoRoulette(oldpop)
			father = @getChromoRoulette(oldpop)
			[baby1, baby2] = crossover(mother.weights, father.weights)
			mutate(baby1)
			mutate(baby2)
			newpop.push(new Bot(baby1))
			newpop.push(new Bot(baby2))
		return newpop


class Bot extends _Bot
	
	constructor: (@weights) ->
		super()
		@fitness = 0
		@nn = new NeuralNet
		@nn.putWeights(@weights)
		console.log('here:', @nn.update([0,0,0,0]))
		@isTop = false

	reset: ->
		# @position =
		# 	x: Math.random()*canvas.width
		# 	y: Math.random()*canvas.height
		@fitness = 0

	tic: ->
		super
		if @isTop then @color = '#088'

# nn = new NeuralNet
# output = nn.update([1,0,1])

# nn.putWeights([0,1.1,2.2,3.3,4,5.1,6.2,7.3,8,9.1,10.2,11.3,12,13.1,14.2,15.3,16,17.1,18.2,19.3,20,21.1,22.2,23.3,24,25.1,26.2,27.3,28,29.1,30.2,31.3,32,33.1,34.2,35.3,36,37.1,38.2,39.3,40,41.1,42.2,43.3,44,45.1,46.2,47.3])
# ws = nn.getWeights()
# console.log(ws, ws.length)
# console.log(nn.update([1,50,1]))

window.tics = 0
window.genCount = 0

genEng = new GeneticEngine

window.NPL = 4 			# Neurons-per-layer
window.NL = 3 			# Number of layers

tic = (step) ->

	if ++window.tics < parameters.numTics
		for bot in window.pop
			bot.tic(step)
			if bot.foundFood() then ++bot.fitness
			bot.render(context)

	else # Reset and gogo next generation.
		console.log('reset please')
		window.tics = 0
		++window.genCount
		window.pop = genEng.epoch(window.pop)


class Board

	constructor: (@canvas) ->
		# window.frame = 0
		# window.vars = {}
		# vars = _.map($(".control"), (i)-> i.id );
		# for name in vars
		# 	window.vars[name] = parseInt($(".control#"+name+" input").attr('value'))
		# 	do ->
		# 		# scope
		# 		n = name
		# 		$(".control#"+name+" input").bind 'change', (event) =>
		# 			window.e = event
		# 			value = Math.max(0.1, parseInt(event.target.value)/\
		# 				parseInt(event.target.dataset.divisor or 1))
		# 			event.target.parentElement.querySelector('span').innerHTML = value
		# 			window.vars[n] = value
		window.context = @canvas.getContext("2d")
		@state = [] # Objects to be drawn.
		@bots = []
		@food = []

		# @addBot(new Bot()) for i in [0..10]
		window.pop = genEng.makeNew(parameters.popSize, (window.NPL+1)*window.NPL*window.NL)		
		console.log('gen:',window.pop)
		@food.push(new Food()) for i in [0..parameters.foodCount]

	render: (context) ->
		item.render(context) for item in @state
		item.render(context) for item in @food
		item.render(context) for item in @bots

	tic: (step) ->
		tic(step)

		++window.frame
		# context.clearRect(0, 0, @canvas.width, @canvas.height)
		painter.drawRectangle(context, {x:0,y:0}, {x:@canvas.width,y:@canvas.height}, 0, {color:"rgba(255,255,255,.3)", fill:true})
		item.tic(step) for item in @food
		# item.tic(step) for item in @bots
		item.tic(step) for item in @state