// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, Icon, Button, Tabs, Tab, ListItemText, ListItem } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { facilityApi, staffApi } from "api/Api";
import { useSelector } from "react-redux";
import { displayMessage } from "../../../store/slices/snackbarSlice";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

function FacilityBooking() {
	const DnDCalendar = withDragAndDrop(Calendar)
	const reduxDispatch = useDispatch();
	const [activeTab, setActiveTab] = useState(0);
	const staff = useSelector(selectStaff);
	const localizer = momentLocalizer(moment);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
	const [comments, setComments] = useState("");
	const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
	const [bookingToDeleteId, setBookingToDeleteId] = useState(null);
	const [bookingToDeleteStartDate, setBookingToDeleteStartDate] = useState(null);
	const [isDeleteConfirmationCalendarOpen, setIsDeleteConfirmationCalendarOpen] = useState(false);


	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const handleSlotSelect = (slotInfo) => {
		setSelectedSlot(slotInfo);
		setIsBookingModalOpen(true);
	}

	const handleBookingConfirmation = () => {

		try {
			console.log(selectedSlot.start)
			const date1 = new Date(selectedSlot.start);
			const date2 = new Date(selectedSlot.end);

			const options = {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false, // Use 24-hour format
			};

			const startDateObj = date1.toLocaleString('en-GB', options);
			const endDateObj = date2.toLocaleString('en-GB', options);

			console.log("hello there");
			// console.log(startDateObj);
			// console.log(endDateObj);
			const currentDate = new Date();
			console.log(date1);
			console.log(currentDate);
			console.log(date1 < currentDate);

			if (date1 < currentDate) {
				setIsBookingModalOpen(false);
				fetchData();
				fetchBookingData();
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Error Encountered",
						content: "Booking cannot be done for past date",
					})
				);
				return
			}
			console.log("facility:" + selectedFacility.status);

			if (selectedFacility.status === 'NON_BOOKABLE') {
				setIsBookingModalOpen(false);
				fetchData();
				fetchBookingData();
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Error Encountered",
						content: "This facility is not available for booking",
					})
				);
				return
			}

			const bookingData = {
				startDateTime: startDateObj,
				endDateTime: endDateObj,
				comments: comments,
				staffUsername: staff.username,
				facilityId: selectedFacility.facilityId,
			};

			console.log(bookingData);

			facilityApi
				.createFacilityBooking(bookingData)
				.then((response) => {
					handleViewAvailability(selectedFacility)
					fetchBookingData();
					const booking = response.data;
					console.log(booking);
					setIsBookingModalOpen(false);
					setComments("");
					reduxDispatch(
						displayMessage({
							color: "success",
							icon: "notification",
							title: "Successfully Created Booking!",
						})
					);
				}).catch((error) => {
					reduxDispatch(
						displayMessage({
							color: "error",
							icon: "notification",
							title: "Error Encountered",
							content: error.response.data,
						})
					);
					console.error("Error fetching data:", error);
				});
		} catch (ex) {
			console.log(ex);
		}
	};

	const handleCloseBookingModal = () => {
		setIsBookingModalOpen(false);
		setSelectedSlot(null);
	};

	const handleEventClick = (event) => {
		setSelectedBooking(event);
		setIsBookingDetailsOpen(true);
	};

	const handleCloseBookingDetails = () => {
		setSelectedBooking(null);
		setIsBookingDetailsOpen(false);
	};

	const formats = {
		eventTimeRangeFormat: ({ start, end }) => {
			const startTime = moment(start).format('LT');
			const endTime = moment(end).format('LT');
			return `${startTime} - ${endTime}`;
		},
	};


	const fetchBookingData = async () => {
		facilityApi
			.getAllBookingsOfAStaff(staff.username)
			.then((response) => {
				const facilities = response.data;
				console.log(facilities);

				const mappedRows = facilities.map((facility) => ({
					facilityBookingId: facility.facilityBookingId,
					startDateTime: moment(new Date(facility.startDateTime)).format('MMMM Do YYYY, h:mm:ss a'),
					endDateTime: moment(new Date(facility.endDateTime)).format('MMMM Do YYYY, h:mm:ss a'),
					comments: facility.comments,
					facilityName: facility.facility.name
				}));

				bookingDataRef.current = {
					...bookingDataRef.current,
					rows: [mappedRows],
				};

				setBookingData((prevData) => ({
					...prevData,
					rows: mappedRows,
				}));
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};


	const [data, setData] = useState({
		columns: [
			{ Header: "Facility ID", accessor: "facilityId", width: "10%" },
			{ Header: "Name", accessor: "name", width: "20%" },
			{ Header: "Location", accessor: "location", width: "20%" },
			{ Header: "Description", accessor: "description", width: "20%" },
			{ Header: "Capacity", accessor: "capacity", width: "10%" },
			{ Header: "Status", accessor: "status", width: "10%" },
			{ Header: "Type", accessor: "type", width: "10%" },
			{
				Header: 'Availability',
				width: '10%',
				accessor: "availability",
				Cell: ({ row }) => (
					<Button onClick={() => handleViewAvailability(row.original)}>
						View Availability
					</Button>
				),
			},

		],
		rows: [],
	});
	const [departments, setDepartments] = useState([]);
	const [calendarEvents, setCalendarEvents] = useState([]);
	const handleBookingDrop = (event) => {
		// Implement booking creation logic here
		console.log('Booking dropped:', event);
	};

	const dataRef = useRef({
		columns: [
			{ Header: "Facility ID", accessor: "facilityId", width: "10%" },
			{ Header: "Name", accessor: "name", width: "20%" },
			{ Header: "Location", accessor: "location", width: "20%" },
			{ Header: "Description", accessor: "description", width: "20%" },
			{ Header: "Capacity", accessor: "capacity", width: "10%" },
			{ Header: "Status", accessor: "status", width: "10%" },
			{ Header: "Type", accessor: "type", width: "10%" },
			{
				Header: 'Availability',
				width: '10%',
				accessor: "availability",
				Cell: ({ row }) => (
					<button onClick={() => handleViewAvailability(row.original)}>
						View Availability
					</button>
				),
			},

		],
		rows: [],
	});

	const [bookingData, setBookingData] = useState({
		columns: [
			{ Header: "Facility Booking ID", accessor: "facilityBookingId", width: "10%" },
			{ Header: "Start Date Time", accessor: "startDateTime", width: "20%" },
			{ Header: "End Date Time", accessor: "endDateTime", width: "20%" },
			{ Header: "Comments", accessor: "comments", width: "20%" },
			{ Header: "Facility Name", accessor: "facilityName", width: "10%" },
			{
				Header: "Actions",
				Cell: ({ row }) => (
					<MDBox>
						<IconButton
							color="secondary"
							onClick={() => handleDeleteFacilityBooking(row.original.facilityBookingId, row.original.startDateTime)}
						>
							<Icon>delete</Icon>
						</IconButton>

					</MDBox>
				),
				width: "10%",
			},
		],
		rows: [],
	})

	const bookingDataRef = useRef({
		columns: [
			{ Header: "Facility Booking ID", accessor: "facilityBookingId", width: "10%" },
			{ Header: "Start Date Time", accessor: "startDateTime", width: "20%" },
			{ Header: "End Date Time", accessor: "endDateTime", width: "20%" },
			{ Header: "Comments", accessor: "comments", width: "20%" },
			{ Header: "Facility Name", accessor: "facilityName", width: "10%" },
			{
				Header: "Actions",
				Cell: ({ row }) => (
					<MDBox>
						<IconButton
							color="secondary"
							onClick={() => handleDeleteFacilityBooking(row.original.facilityBookingId, row.original.startDateTime)}
						>
							<Icon>delete</Icon>
						</IconButton>

					</MDBox>
				),
				width: "10%",
			},
		],
		rows: [],
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	// const [formData, setFormData] = useState({
	// 	departmentId: null,
	// 	name: "",
	// 	location: "",
	// 	description: "",
	// 	capacity: "",
	// 	facilityStatusEnum: "",
	// 	facilityTypeEnum: "",
	// });

	const [selectedFacility, setSelectedFacility] = useState(null);
	const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

	const handleViewAvailability = (facility) => {
		console.log("selected facility: " + facility.facilityStatusEnum);
		setSelectedFacility(facility);
		setIsCalendarModalOpen(true);

		facilityApi
			.findAllBookingsOfAFacility(facility.facilityId)
			.then((response) => {
				const facilityBookings = response.data;
				console.log(facilityBookings);

				// Create an array of promises for fetching staff details
				const staffPromises = facilityBookings.map((booking) => {
					return staffApi.getStaffByUsername(booking.staffUsername); // Replace with your API call
				});

				// Use Promise.all to resolve all staff detail requests
				Promise.all(staffPromises)
					.then((staffDetails) => {
						const mappedEvents = facilityBookings.map((booking, index) => {
							const staff = staffDetails[index];
							console.log("Staff details:", staff);
							const title = `Booked by ${staff.data.firstname} ${staff.data.lastname}`;
							const ownerFullName = `${staff.data.firstname} ${staff.data.lastname}`;

							return {
								title,
								ownerFullName,
								facilityBookingId: booking.facilityBookingId,
								comments: booking.comments,
								staffUsername: booking.staffUsername,
								start: new Date(booking.startDateTime),
								end: new Date(booking.endDateTime),
								facilityBookingId: booking.facilityBookingId,
								owner: booking.staffUsername,
								resizable: true,
								draggable: true,
							};
						});

						setCalendarEvents(mappedEvents);
					})
					.catch((error) => {
						console.error("Error fetching staff data:", error);
					});
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const eventStyleGetter = (event) => {

		if (event.owner === staff.username) {
			var style = {
				backgroundColor: 'green',
				opacity: 0.8,
				color: 'white',

			};
			return {
				style: style
			};

		}
		return {};
	};

	const handleCloseCalendarModal = () => {
		setIsCalendarModalOpen(false);
	};


	const handleDeleteBooking = async (id, startDateTime) => {
		try {
			console.log(startDateTime);
			const currentDate = new Date();
			// const bookingDate = new Date(startDateTime);
			console.log(currentDate);
			// console.log(bookingDate)
			console.log(startDateTime < currentDate);
			if (startDateTime < currentDate) {
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Error Encountered",
						content: "Deletion cannot be done for past date",
					})
				);
				return
			}
			facilityApi
				.deleteFacilityBooking(id)
				.then((response) => {
					const updatedEvents = calendarEvents.filter((event) => event.facilityBookingId !== id);
					fetchData();
					fetchBookingData();
					setCalendarEvents(updatedEvents);
					setIsBookingDetailsOpen(false);
					setIsDeleteConfirmationCalendarOpen(false);

					reduxDispatch(
						displayMessage({
							color: "success",
							icon: "notification",
							title: "Successfully Deleted Booking!",
						})
					);
				}).catch((error) => {
					setIsDeleteConfirmationCalendarOpen(false);
					reduxDispatch(
						displayMessage({
							color: "error",
							icon: "notification",
							title: "Error Encountered",
							content: error.response.data,
						})
					);
					console.error("Error fetching data:", error);
				});
		} catch (ex) {
			console.error(ex);
		}
	};

	const handleDeleteFacilityBookingCalendar = (facilityBookingId, startDateTime) => {
		setBookingToDeleteId(facilityBookingId);
		setBookingToDeleteStartDate(startDateTime);
		setIsDeleteConfirmationCalendarOpen(true);
	};

	const handleDeleteFacilityBooking = (facilityBookingId, startDateTime) => {
		setBookingToDeleteId(facilityBookingId);
		setBookingToDeleteStartDate(startDateTime);
		setDeleteConfirmationOpen(true);
	};

	const handleConfirmDeleteBooking = (facilityBookingId, startDateTime) => {
		try {
			console.log(startDateTime);
			const currentDate = new Date();
			// const bookingDate = new Date(startDateTime);
			console.log(currentDate);
			// console.log(bookingDate);
			const dateComponents = startDateTime.match(/(\w+) (\d+)(?:st|nd|rd|th)? (\d+), (\d+):(\d+):(\d+) ([APap][Mm])/);

			const [, month, day, year, hours, minutes, seconds, ampm] = dateComponents;

			// Convert month name to its numerical representation (January is 0, February is 1, etc.)
			const monthIndex = new Date(Date.parse(`${month} 1, 2000`)).getMonth();

			// Adjust hours for 12-hour format
			let parsedHours = parseInt(hours, 10);
			if (ampm.toLowerCase() === 'pm' && parsedHours !== 12) {
				parsedHours += 12;
			} else if (ampm.toLowerCase() === 'am' && parsedHours === 12) {
				parsedHours = 0;
			}

			// Create the Date object
			const parsedDate = new Date(year, monthIndex, day, parsedHours, minutes, seconds);

			console.log(parsedDate);

			console.log(parsedDate < currentDate);
			if (parsedDate < currentDate) {
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Error Encountered",
						content: "Deletion cannot be done for past date",
					})
				);
				return
			}
			facilityApi
				.deleteFacilityBooking(facilityBookingId)
				.then(() => {
					fetchData();
					fetchBookingData();
					setDeleteConfirmationOpen(false);

					reduxDispatch(
						displayMessage({
							color: "success",
							icon: "notification",
							title: "Successfully Deleted Facility!",
							content: "Facility Booking with facilitybooking Id: " + facilityBookingId + " deleted",
						})
					);
				})
				.catch((err) => {
					reduxDispatch(
						displayMessage({
							color: "error",
							icon: "notification",
							title: "Error Encountered",
							content: err.response.data,
						})
					);
					console.log(err);
				});
		} catch (ex) {
			console.error(ex);
		}
	}

	const fetchData = async () => {
		facilityApi
			.findAllFacility()
			.then((response) => {
				const facilities = response.data;

				console.log(facilities);

				const mappedRows = facilities.map((facility) => ({
					facilityId: facility.facilityId,
					name: facility.name,
					location: facility.location,
					description: facility.description,
					capacity: facility.capacity,
					status: facility.facilityStatusEnum,
					type: facility.facilityTypeEnum,
					availability: facility.listOfFacilityBookings,
				}));

				dataRef.current = {
					...dataRef.current,
					rows: [mappedRows],
				};

				setData((prevData) => ({
					...prevData,
					rows: mappedRows,
				}));
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const handleEventResize = async (event) => {
		try {
			const eventIndex = calendarEvents.findIndex((ev) => ev.id === event.id);

			if (eventIndex !== -1) {
				const date1 = new Date(event.start);
				const date2 = new Date(event.end);

				const options = {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false, // Use 24-hour format
				};

				const startDateObj = date1.toLocaleString('en-GB', options);
				const endDateObj = date2.toLocaleString('en-GB', options);

				console.log("hello there");
				// console.log(startDateObj);
				// console.log(endDateObj);
				const currentDate = new Date();
				console.log(date1);
				console.log(currentDate);
				console.log(date1 < currentDate);

				if (date1 < currentDate) {
					setIsBookingModalOpen(false);
					fetchData();
					fetchBookingData();
					reduxDispatch(
						displayMessage({
							color: "error",
							icon: "notification",
							title: "Error Encountered",
							content: "Booking cannot be done for past date",
						})
					);
					return
				}


				if (event.event.staffUsername === staff.username) {
					const updatedEvent = {
						...calendarEvents[eventIndex],
						start: startDateObj,
						end: endDateObj,
						facilityId: selectedFacility.facilityId,
						facilityBookingId: event.event.facilityBookingId,
						comments: event.event.comments,
						staffUsername: event.event.staffUsername,
					};

					facilityApi
						.updateFacilityBooking(updatedEvent)
						.then((response) => {
							const booking = response.data;
							console.log(booking);
							handleViewAvailability(selectedFacility);
							reduxDispatch(
								displayMessage({
									color: "success",
									icon: "notification",
									title: "Successfully Updated Booking!",
								})
							);
						})
						.catch((err) => {
							if (err.response.data.detail) {
								reduxDispatch(
									displayMessage({
										color: "error",
										icon: "notification",
										title: "Error Encountered",
										content: err.response.data.detail,
									})
								);
							} else {
								reduxDispatch(
									displayMessage({
										color: "error",
										icon: "notification",
										title: "Error Encountered",
										content: err.response.data,
									})
								);
							}
							console.log(err.response.data.detail)
						})
				} else {
					console.log("Permission denied: You cannot resize this event.");
					reduxDispatch(
						displayMessage({
							color: "error",
							icon: "notification",
							title: "Permission denied: You cannot resize an event you didn't create.",
						})
					);
				}
			}
		} catch (ex) {
			console.log(ex.response.data);
			reduxDispatch(
				displayMessage({
					color: "error",
					icon: "notification",
					title: "Error Encountered",
					content: ex.response.data,
				})
			);
		}
	};

	const handleEventDrop = async (event) => {
		try {
			const eventIndex = calendarEvents.findIndex((ev) => ev.id === event.id);

			if (eventIndex !== -1) {
				const date1 = new Date(event.start);
				const date2 = new Date(event.end);

				const options = {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false, // Use 24-hour format
				};

				const startDateObj = date1.toLocaleString('en-GB', options);
				const endDateObj = date2.toLocaleString('en-GB', options);

				console.log("hello there");
				// console.log(startDateObj);
				// console.log(endDateObj);
				const currentDate = new Date();
				console.log(date1);
				console.log(currentDate);
				console.log(date1 < currentDate);

				if (date1 < currentDate) {
					setIsBookingModalOpen(false);
					fetchData();
					fetchBookingData();
					reduxDispatch(
						displayMessage({
							color: "error",
							icon: "notification",
							title: "Error Encountered",
							content: "Booking cannot be done for past date",
						})
					);
					return
				}
				if (event.event.staffUsername === staff.username) {
					const updatedEvent = {
						...calendarEvents[eventIndex],
						start: startDateObj,
						end: endDateObj,
						facilityId: selectedFacility.facilityId,
						facilityBookingId: event.event.facilityBookingId,
						comments: event.event.comments,
						staffUsername: event.event.staffUsername,
					};

					facilityApi
						.updateFacilityBooking(updatedEvent)
						.then((response) => {
							const booking = response.data;
							console.log(booking);
							handleViewAvailability(selectedFacility);
							reduxDispatch(
								displayMessage({
									color: "success",
									icon: "notification",
									title: "Successfully Updated Booking!",
								})
							);
						})
						.catch((err) => {
							if (err.response.data.detail) {
								reduxDispatch(
									displayMessage({
										color: "error",
										icon: "notification",
										title: "Error Encountered",
										content: err.response.data.detail,
									})
								);
							} else {
								reduxDispatch(
									displayMessage({
										color: "error",
										icon: "notification",
										title: "Error Encountered",
										content: err.response.data,
									})
								);
							}
							console.log(err.response.data.detail)
						})
				} else {
					console.log("Permission denied: You cannot move this booking.");
					reduxDispatch(
						displayMessage({
							color: "error",
							icon: "notification",
							title: "Permission denied: You cannot move a booking you didn't create.",
						})
					);
				}
			}
		} catch (ex) {
			console.error(ex);
		}
	}


	const calendarConfig = {
		selectable: true,
		events: calendarEvents,
		defaultView: 'week',
		views: {
			week: true,
			day: true,
			agenda: true,
		},
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,week,day,agenda', // Use default view names
		},
		onSelectEvent: handleEventClick,
		onEventResize: handleEventResize, // Add this callback for resizing
		onEventDrop: handleEventDrop,     // Add this callback for dragging
		resizable: true,                 // Enable event resizing
		draggable: true,
	};

	useEffect(() => {
		fetchData();
		fetchBookingData();
	}, []);

	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox pt={6} pb={3}>
				<Grid container spacing={6}>
					<Grid item xs={12}>
						<Card>
							<MDBox
								mx={2}
								mt={-3}
								py={3}
								px={2}
								variant="gradient"
								bgColor="info"
								borderRadius="lg"
								coloredShadow="info"
							>
								<MDTypography variant="h6" color="white">
									Facilties Booking
								</MDTypography>
							</MDBox>

							<MDBox pt={3}>
								<Tabs value={activeTab} onChange={handleTabChange}>
									<Tab label="All Facility Bookings" />
									<Tab label="My Facility Bookings" />
								</Tabs>
								{activeTab === 0 && (
									// Render the data table for all facility bookings
									<DataTable canSearch={true} table={data} />
								)}

								{activeTab === 1 && (
									// Render the data table for the logged-in staff's bookings
									<DataTable canSearch={true} table={bookingData} />
								)}
								<Dialog
									open={isCalendarModalOpen}
									onClose={handleCloseCalendarModal}
									maxWidth="lg"
									fullWidth
								>
									<DialogTitle>
										Availability Calendar for {selectedFacility?.name}
										<IconButton
											edge="end"
											color="inherit"
											onClick={handleCloseCalendarModal}
											aria-label="close"
											sx={{ position: 'absolute', right: 8, top: 8 }}
										>
											<CloseIcon />
										</IconButton>
									</DialogTitle>
									<DialogContent>
										<DnDCalendar
											localizer={localizer}
											formats={formats}
											{...calendarConfig}
											onSelectEvent={(event) => handleEventClick(event, event.facilityBookingId)}
											selectable
											onSelectSlot={handleSlotSelect}
											eventPropGetter={eventStyleGetter}
											onEventResize={(event) => handleEventResize(event, event.facilityBookingId)}

										/>
									</DialogContent>
								</Dialog>
								<Dialog open={isBookingDetailsOpen} onClose={handleCloseBookingDetails}>
									<DialogTitle>Facility Booking Details</DialogTitle>
									<DialogContent>
										{selectedBooking && (
											<>
												<ListItem>
													<ListItemText primary="Booking ID:" secondary={""} />
													<MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
														{selectedBooking.facilityBookingId}
													</MDTypography>
												</ListItem>
												<ListItem>
													<ListItemText primary="Start Time:" secondary={""} />
													<MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
														{moment(selectedBooking.start).format('MMMM Do YYYY, h:mm:ss a')}
													</MDTypography>
												</ListItem>
												<ListItem>
													<ListItemText primary="End Time:" secondary={""} />
													<MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
														{moment(selectedBooking.end).format('MMMM Do YYYY, h:mm:ss a')}
													</MDTypography>
												</ListItem>
												<ListItem>
													<ListItemText primary="Booked by:" secondary={""} />
													<MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
														{selectedBooking.ownerFullName}
													</MDTypography>
												</ListItem>
												<ListItem>
													<ListItemText primary="Comments:" secondary={""} />
													<MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
														{selectedBooking.comments}
													</MDTypography>
												</ListItem>

												{selectedBooking.staffUsername === staff.username && (
													<Button
														variant="contained"
														style={{ backgroundColor: 'red', color: 'white' }}
														onClick={() => handleDeleteFacilityBookingCalendar(selectedBooking.facilityBookingId, selectedBooking.start)}													>
														Delete Booking
													</Button>
												)}
											</>
										)}
									</DialogContent>
								</Dialog>
								<Dialog
									open={isBookingModalOpen}
									onClose={handleCloseBookingModal}
									maxWidth="sm"
									fullWidth
								>
									<DialogTitle>Confirm Booking</DialogTitle>
									<DialogContent>
										{selectedSlot && (
											<div>
												<p>
													<b>Facility Name: </b>{selectedFacility.name}
												</p>
												<p> <b>Booking Start Time: </b>{selectedSlot.start ? moment(selectedSlot.start).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</p>
												<p><b>Booking End Time: </b>{selectedSlot.end ? moment(selectedSlot.end).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</p>
												<br></br>
												<TextField
													label="Comments"
													multiline
													rows={4}
													variant="outlined"
													fullWidth
													value={comments}
													onChange={(e) => setComments(e.target.value)} // Update comments state
												/>
											</div>
										)}
									</DialogContent>
									<DialogActions>
										<Button onClick={handleCloseBookingModal} color="primary">
											Cancel
										</Button>
										<Button onClick={() => handleBookingConfirmation()} color="primary">
											Confirm
										</Button>
									</DialogActions>
								</Dialog>
								<Dialog open={isDeleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
									<DialogTitle>Confirm Deletion</DialogTitle>
									<DialogContent>
										Are you sure you want to delete this booking?
									</DialogContent>
									<DialogActions>
										<Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
											Cancel
										</Button>
										<Button onClick={() => handleConfirmDeleteBooking(bookingToDeleteId, bookingToDeleteStartDate)} color="primary">
											Confirm
										</Button>
									</DialogActions>
								</Dialog>
								<Dialog open={isDeleteConfirmationCalendarOpen} onClose={() => setIsDeleteConfirmationCalendarOpen(false)}>
									<DialogTitle>Confirm Deletion</DialogTitle>
									<DialogContent>
										Are you sure you want to delete this booking?
									</DialogContent>
									<DialogActions>
										<Button onClick={() => setIsDeleteConfirmationCalendarOpen(false)} color="primary">
											Cancel
										</Button>
										<Button onClick={() => handleDeleteBooking(bookingToDeleteId, bookingToDeleteStartDate)} color="primary">
											Confirm
										</Button>
									</DialogActions>
								</Dialog>

							</MDBox>
						</Card>
					</Grid>
				</Grid>
			</MDBox>

		</DashboardLayout >
	);
}

export default FacilityBooking;
