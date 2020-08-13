import PropTypes from 'prop-types'
import React from 'react'
import FormField from 'part:@sanity/components/formfields/default'
import PatchEvent, {set, unset} from '@sanity/form-builder/PatchEvent'
import { ChromePicker } from 'react-color'
import { FaEyeDropper } from 'react-icons/fa'
import styled from 'styled-components'
import { EyeDropper } from 'react-eyedrop'

import TextInput from 'part:@sanity/components/textinputs/default'

import rgb2hex from 'rgb2hex'

const PickerStyles = styled.div`
  position: relative;
  
  .--mb--color-picker {
    position: relative !important;
    width: 100%;
    box-shadow: none;
    z-index: 1;
  }

  .color-picker-header {
    display: none;
  }

  .color-picker-body {
    padding: 0;
  }

  .colorInput {
    input {
      padding-left: 46px;
    }
  }
`

const ColorPreview = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 28px;
  height: 28px;
  background-color: ${props => props.color || '#fff'};
  border-radius: 10000px;
  border: 1px solid rgb(189, 198, 212);
  overflow: hidden;
  z-index: 1;
  
  &:hover {
    cursor: pointer;
  }
`

const Dropper = styled.button`
  appearance: none;
  // position: absolute;
  // top: 0;
  position: absolute;
  top: -92px;
  left: 6px;
  z-index: 10;
  background-color: ${props => props.color ? props.color : '#fff'};
  color: ${props => setColor(props.color || '#fff')};
  width: 20px;
  height: 20px;
  border: 1px solid rgb(189, 198, 212);
  border-radius: 1000px;
`

const hexRegex = /^#[0-9A-F]{6}$/i

const hex2rgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16)
  } : null;
}

const setColor = (color) => {
  // Need to find a way to convert hex to rgb
  const { red, green, blue } = hex2rgb(color)
  if ((red*0.299 + green*0.587 + blue*0.114) > 186) {
    return '#000'
  }

  return '#fff'
}

const DropperButton = ({ onClick, customProps : { color }}) => (
  <Dropper
    className="btn"
    onClick={onClick}
    color={color}
  >
    <FaEyeDropper size={'0.65em'} style={{ position: 'relative', left: -2, top: -1}} />
  </Dropper>
)

class ColorPicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      pickColor: false
    }
  }

  focus() {
    this._inputElement.focus()
  }

  handlePickerChange(color) {
    const patch = color.hex === '' ? unset() : set(color.hex)
    this.props.onChange(PatchEvent.from(patch))
  }

  handleChange(event) {
    let color

    if (event.target) {
      color = event.target.value

      if (color.slice(0,1) !== '#') {
        color = '#' + color
      }
      console.log(color.slice(0,1))
    } else {
      const rgbValue = event.split(',')
      console.log(rgbValue)

      if (rgbValue.length) {
        color = rgb2hex(event)
        color = color.hex
      } else {
        color = event
      }
    }

    const patch = color === '' ? unset() : set(color)
    this.props.onChange(PatchEvent.from(patch))
  }

  handleEyedropper({ hex }) {
    const patch = set(hex)
    this.props.onChange(PatchEvent.from(patch))
  }

  handleClear(event) {
    event.preventDefault()
    this.props.onChange(PatchEvent.from(unset()))
    this.setState({pickColor: false })
  }

  handleClose(event) {
    event.preventDefault()
    this.setState({pickColor: false})
  }

  openPicker(event) {
    event.preventDefault()
    this.setState({ pickColor: !this.state.pickColor })
  }

  render() {
    const {type, value, level, markers} = this.props
    return (
      <PickerStyles>
        <FormField
          label={type.title}
          level={level}
          description={type.description}
        >
          <div className={'colorInput'} style={{ position: 'relative' }}>
            <ColorPreview color={hexRegex.test(value) ? value : '#fff'} onClick={this.openPicker} />

            <TextInput
              type="text"
              value={value === undefined ? '' : value}
              onChange={this.handleChange}
            />
          </div>

          {this.state.pickColor &&
            <div style={{ marginTop: 20, position: 'relative' }}>
              <ChromePicker
                color={value || '#000'}
                onChange={this.handlePickerChange}
                onChangeComplete={this.handlePickerChange}
                disableAlpha={true}
              />
              <EyeDropper
                onChange={this.handleEyedropper}
                cursorActive={'crosshair'}
                customComponent={DropperButton}
                customProps={{ color: value || '#000'}}
              />
            </div>
          }
        </FormField>
      </PickerStyles>
    )
  }
}

ColorPicker.propTypes = {
  type: PropTypes.shape({
    title: PropTypes.string
  }).isRequired,
  level: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
}

export default ColorPicker;