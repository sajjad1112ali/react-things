import * as React from "react";
import { Container, Box } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = ["STEP 1", "STEP 2", "STEP 3"];

const StepOne = (values, setFunc, handleChange) => {
  return (
    <form>
      <div className="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          type="text"
          className="form-control"
          name="email"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          onChange={(event) => handleChange(event, setFunc)}
          value={values.email}
        />
      </div>
    </form>
  );
};

const StepTwo = (values, setFunc, handleChange) => {
  return (
    <form>
      <div className="form-group">
        <label for="exampleInputEmail1">Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
          placeholder="Enter name"
          onChange={(event) => handleChange(event, setFunc)}
          value={values.name}
        />
      </div>
    </form>
  );
};

const StepThree = () => {
  return (
    <form>
      <div className="form-group">
        <label for="exampleInputEmail1">Contact</label>
        <input
          type="text"
          className="form-control"
          name="contact"
          placeholder="Enter contact"
          value={5555555}
        />
      </div>
    </form>
  );
};

export default function SignUp() {
  const [activeStep, setActiveStep] = React.useState(0);
  const stepOneObj = {
    email: "",
    formErrors: { email: "" },
    isValid: false,
    passwordValid: false,
    formValid: false,
  };

  const stepTwoObj = {
    name: "",
    formErrors: { name: "" },
    isValid: false,
    formValid: false,
  };

  const [stepOne, setStepOne] = React.useState(stepOneObj);
  const [stepTwo, setStepTwo] = React.useState(stepTwoObj);
  const [skipped, setSkipped] = React.useState(new Set());

  const handleChange = (event, stepFunc) => {
    event.persist();
    stepFunc((values) => ({
      ...values,
      [event.target.name]: event.target.value,
      isValid: event.target.value.length > 0,
    }));
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const getCurrentStepComponent = (step) => {
    switch (step) {
      case 0:
        return StepOne(stepOne, setStepOne, handleChange);
      case 1:
        return StepTwo(stepTwo, setStepTwo, handleChange);
      case 2:
        return StepThree();

      default:
        break;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {getCurrentStepComponent(activeStep)}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}

              <Button
                disabled={
                  (!stepOne.isValid && activeStep === 0) ||
                  (!stepTwo.isValid && activeStep === 1)
                }
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
}
