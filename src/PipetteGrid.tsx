import React, { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "./style.css" // Your custom styles

const PipetteGrid: React.FC = () => {
  const [pipetteConfig, setPipetteConfig] = useState<string>("")
  const [pipetteConfiguration, setPipetteConfiguration] = useState<string>("")
  const [startingLocation, setStartingLocation] = useState<string>("")
  const [canAddTipRack, setCanAddTipRack] = useState(false)
  const [currentTipRackType, setCurrentTipRackType] = useState<string | null>(
    null,
  )

  const handlePipetteConfigChange = (
    event: React.ChangeEvent<HTMLElement>,
  ) => {
    setPipetteConfig((event.target as HTMLSelectElement).value)
    setPipetteConfiguration("")
    setStartingLocation("")
  }

  const handlePipetteConfigurationChange = (
    event: React.ChangeEvent<HTMLElement>,
  ) => {
    setPipetteConfiguration((event.target as HTMLSelectElement).value)
    setStartingLocation("")
  }

  const handleStartingLocationChange = (
    event: React.ChangeEvent<HTMLElement>,
  ) => {
    setStartingLocation((event.target as HTMLSelectElement).value)
  }

  const handleAddTipRackClick = () => {
    setCanAddTipRack(true)
    setCurrentTipRackType("full")
  }

  const handleGridClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const target = event.target as HTMLElement
    const gridItem = target.closest(".grid-item")
    if (
      canAddTipRack &&
      gridItem &&
      !gridItem.querySelector(".tip-rack") &&
      !gridItem.classList.contains("row-label") &&
      !gridItem.classList.contains("col-label")
    ) {
      addTipRack(gridItem)
      setCanAddTipRack(false)
    }
  }

  const addTipRack = (gridItem: Element) => {
    const tipRack = document.createElement("div")
    tipRack.className = `tip-rack ${currentTipRackType}`
    tipRack.innerText = currentTipRackType === "full" ? "Full Tip Rack" : ""
    tipRack.style.fontSize = "12px" // Smaller text for Full Tip Rack
    gridItem.appendChild(tipRack)
    updateFullTipRack()
  }

  const updateFullTipRack = () => {
    const tipRack = document.querySelector(".tip-rack.full")
    if (tipRack) {
      addStartingLocation(tipRack)
      addPipetteEntity(tipRack)
    }
  }

  const getOppositeCorner = (position: string): string => {
    switch (position) {
      case "top-left":
        return "bottom-right"
      case "bottom-left":
        return "top-right"
      case "top-right":
        return "bottom-left"
      case "bottom-right":
        return "top-left"
      default:
        return position // fallback, although this shouldn't be reached
    }
  }

  const addStartingLocation = (tipRack: Element) => {
    if (!pipetteConfig || !pipetteConfiguration || !startingLocation) return

    let startingElement
    if (pipetteConfiguration === "single" && pipetteConfig === "96-channel") {
      const oppositeCorner = getOppositeCorner(startingLocation)
      startingElement = document.createElement("div")
      startingElement.className = `starting-location small-circle ${oppositeCorner}`
    } else if (pipetteConfiguration === "single") {
      startingElement = document.createElement("div")
      startingElement.className = `starting-location small-circle ${startingLocation === "top-left" ? "bottom-left" : "top-left"}`
    } else if (
      pipetteConfiguration === "row" &&
      pipetteConfig === "96-channel"
    ) {
      startingElement = document.createElement("div")
      startingElement.className = `starting-location oblong-row ${startingLocation === "top" ? "bottom" : "top"}`
    } else if (
      pipetteConfiguration === "column" &&
      pipetteConfig === "96-channel"
    ) {
      startingElement = document.createElement("div")
      startingElement.className = `starting-location oblong-column ${startingLocation === "right" ? "left" : "right"}`
    } else if (pipetteConfiguration === "partial-column") {
      startingElement = document.createElement("div")
      startingElement.className = `starting-location oblong-partial-column`
    }

    if (startingElement) {
      const existingStartingLocation =
        tipRack.querySelector(".starting-location")
      if (existingStartingLocation) {
        existingStartingLocation.remove()
      }
      tipRack.appendChild(startingElement)
    }
  }

  const addPipetteEntity = (tipRack: Element) => {
    if (!pipetteConfig || !pipetteConfiguration || !startingLocation) return

    let pipetteElement = document.createElement("div")
    pipetteElement.className = `pipette pipette-${pipetteConfig.replace("single-", "")}`

    if (pipetteConfiguration === "single") {
      pipetteElement.className += ` ${startingLocation}`
    } else if (pipetteConfiguration === "row") {
      pipetteElement.className += ` ${startingLocation}`
    } else if (pipetteConfiguration === "column") {
      pipetteElement.className += ` ${startingLocation}`
    } else if (pipetteConfiguration === "partial-column") {
      pipetteElement.className += ` partial-column ${startingLocation}`
    }

    const existingPipette = tipRack.querySelector(".pipette")
    if (existingPipette) {
      existingPipette.remove()
    }

    tipRack.appendChild(pipetteElement)
  }

  const clearTipRacks = () => {
    const tipRacks = document.querySelectorAll(".tip-rack")
    tipRacks.forEach((tipRack) => tipRack.remove())
    setCanAddTipRack(false)
  }

  useEffect(() => {
    updateFullTipRack()
  }, [pipetteConfig, pipetteConfiguration, startingLocation])

  return (
    <Container className="d-flex flex-column align-items-center mt-4">
      <Form className="w-50">
        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Label>Select Attached Pipettes:</Form.Label>
            <Form.Control
              as="select"
              value={pipetteConfig}
              onChange={handlePipetteConfigChange}
            >
              <option value="">--Select--</option>
              <option value="96-channel">96-channel</option>
              <option value="single-8-channel">single 8-channel</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Label>Select Pipette Configuration:</Form.Label>
            <Form.Control
              as="select"
              value={pipetteConfiguration}
              onChange={handlePipetteConfigurationChange}
              disabled={!pipetteConfig}
            >
              <option value="">--Select--</option>
              {pipetteConfig === "96-channel" && (
                <>
                  <option value="single">Single</option>
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                </>
              )}
              {pipetteConfig === "single-8-channel" && (
                <>
                  <option value="single">Single</option>
                  <option value="partial-column">Partial Column</option>
                </>
              )}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Label>Select Starting Nozzle:</Form.Label>
            <Form.Control
              as="select"
              value={startingLocation}
              onChange={handleStartingLocationChange}
              disabled={!pipetteConfig || !pipetteConfiguration}
            >
              <option value="">--Select--</option>
              {pipetteConfig === "96-channel" &&
                pipetteConfiguration === "single" && (
                  <>
                    <option value="top-left">
                      Top Left (NW) Nozzle A1 (H12 starting tip)
                    </option>
                    <option value="bottom-left">
                      Bottom Left (SW) Nozzle H1 (A12 starting tip)
                    </option>
                    <option value="top-right">
                      Top Right (NE) Nozzle A12 (H1 starting tip)
                    </option>
                    <option value="bottom-right">
                      Bottom Right (SE) Nozzle H12 (A1 starting tip)
                    </option>
                  </>
                )}
              {pipetteConfig === "96-channel" &&
                pipetteConfiguration === "row" && (
                  <>
                    <option value="top">Top (North) Nozzles - A1</option>
                    <option value="bottom">Bottom (South) Nozzles - H1</option>
                  </>
                )}
              {pipetteConfig === "96-channel" &&
                pipetteConfiguration === "column" && (
                  <>
                    <option value="left">Left (West) Nozzles - A1</option>
                    <option value="right">Right (East) Nozzles - A12</option>
                  </>
                )}
              {pipetteConfig === "single-8-channel" &&
                pipetteConfiguration === "single" && (
                  <>
                    <option value="top-left">Top Left - A1</option>
                    <option value="bottom-left">Bottom Left - H1</option>
                  </>
                )}
              {pipetteConfig === "single-8-channel" &&
                pipetteConfiguration === "partial-column" && (
                  <option value="bottom-left">Bottom Left - H1</option>
                )}
            </Form.Control>
          </Col>
        </Form.Group>
      </Form>

      <div className="buttons mt-4">
        <Button
          variant="primary"
          className="me-2"
          onClick={handleAddTipRackClick}
        >
          Add a Full Tip Rack
        </Button>
        <Button variant="danger" onClick={clearTipRacks}>
          Clear
        </Button>
      </div>

      <div className="grid-container mt-4" onClick={handleGridClick}>
        <div className="grid-item empty"></div>
        <div className="grid-item col-label">1</div>
        <div className="grid-item col-label">2</div>
        <div className="grid-item col-label">3</div>

        <div className="grid-item row-label">A</div>
        <div className="grid-item" data-position="A1">
          A1
        </div>
        <div className="grid-item" data-position="A2">
          A2
        </div>
        <div className="grid-item" data-position="A3">
          A3
        </div>

        <div className="grid-item row-label">B</div>
        <div className="grid-item" data-position="B1">
          B1
        </div>
        <div className="grid-item" data-position="B2">
          B2
        </div>
        <div className="grid-item" data-position="B3">
          B3
        </div>

        <div className="grid-item row-label">C</div>
        <div className="grid-item" data-position="C1">
          C1
        </div>
        <div className="grid-item" data-position="C2">
          C2
        </div>
        <div className="grid-item" data-position="C3">
          C3
        </div>

        <div className="grid-item row-label">D</div>
        <div className="grid-item" data-position="D1">
          D1
        </div>
        <div className="grid-item" data-position="D2">
          D2
        </div>
        <div className="grid-item" data-position="D3">
          D3
        </div>
      </div>
    </Container>
  )
}

export default PipetteGrid
