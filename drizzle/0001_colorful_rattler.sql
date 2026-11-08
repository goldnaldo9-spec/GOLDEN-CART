CREATE TABLE `customerOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(32) NOT NULL,
	`userId` int,
	`customerName` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`address` text NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	`shipping` decimal(10,2) NOT NULL,
	`tax` decimal(10,2) NOT NULL,
	`discount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`total` decimal(10,2) NOT NULL,
	`couponCode` varchar(32),
	`status` enum('Processing','Shipped','Out for Delivery','Delivered') NOT NULL DEFAULT 'Processing',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customerOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `customerOrders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` varchar(64) NOT NULL,
	`productName` varchar(240) NOT NULL,
	`image` varchar(500),
	`unitPrice` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL,
	`variantJson` text,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketNumber` varchar(32) NOT NULL,
	`userId` int,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`orderNumber` varchar(32),
	`issue` varchar(120) NOT NULL,
	`message` text NOT NULL,
	`photoName` varchar(255),
	`status` enum('Open','In Review','Resolved') NOT NULL DEFAULT 'Open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `supportTickets_ticketNumber_unique` UNIQUE(`ticketNumber`)
);
