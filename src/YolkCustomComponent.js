const create = require(`yolk-virtual-dom/create-element`)
const wrapObject = require(`./wrapObject`)
const addProperties = require(`./addProperties`)

function YolkCustomComponent (props, children) {
  this._props = props
  this._child = children[0]
  this._isMounted = false
}

YolkCustomComponent.extend = function extend (obj) {
  function Component (props, children) {
    YolkCustomComponent.call(this, props, children)
  }

  addProperties(Component.prototype, YolkCustomComponent.prototype, obj)

  return Component
}

YolkCustomComponent.prototype = {
  type: `Widget`,

  onMount () {
    throw Error(`${this.constructor.name} did not implement #onMount`)
  },

  onUpdate () {
    throw Error(`${this.constructor.name} did not implement #onUpdate`)
  },

  onUnmount () {
    throw Error(`${this.constructor.name} did not implement #onUnmount`)
  },

  init () {
    let node = create(this._child)

    wrapObject(this._props).subscribe(props => {
      if (!this._isMounted) {
        this.onMount(props, node)
        this._isMounted = true
      } else {
        this.onUpdate(props, node)
      }
    })

    return node
  },

  predestroy (node) {
    this.onUnmount(node)
  },
}

module.exports = YolkCustomComponent
