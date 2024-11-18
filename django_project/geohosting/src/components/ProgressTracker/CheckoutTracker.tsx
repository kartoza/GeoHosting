import ProgressTracker from "./ProgressTracker";

const steps = [
  { title: "Configuration", description: "Configure your application" },
  { title: "Payment", description: "Choose your payment method" },
  { title: "Deployment", description: "Deploying your service" },
  { title: "Finish", description: "Your service is up" },
];

function CheckoutTracker({ activeStep }) {
  return (
    <ProgressTracker activeStep={activeStep} steps={steps}/>
  )
}

export default CheckoutTracker;
