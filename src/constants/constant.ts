//  api url
export const ROOT_URL = "http://20.248.116.199:8000/api";

// colors
export const primaryColor = "#2C71F6";
export const hoverPrimaryColor = "#2c6ff6e0";
export const backgroundColor = "#EBEBEB";
export const backgroundDark = "#1A2130";
export const strokes = "#e1e1e1af";

// enum
export enum Order_Status {
	pending = "Pending",
	waiting_to_pickup = "Waiting To Pick-Up",
	on_progress = "On Proggres",
	process_done = "Process Done",
	ready_for_pickup = "Ready For Pickup",
	awaiting_for_pickup = "Awaiting For Pickup",
	pickup_completed = "Pickup Completed",
	ready_for_delivery = "Ready For Delivery",
	delivered = "Delivered",
	received = "Received",
	canceled = "Canceled",
}

export enum Payment_Status {
	pending = "Pending",
	waiting_to_payment = "Waiting To Payment",
	paid = "Paid",
	refunded = "Refunded",
	failed = "Failed",
}
