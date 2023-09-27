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
import { IconButton, Icon, Button, Tabs, Tab } from "@mui/material";
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

import { facilityApi, departmentApi } from "api/Api";
import { useSelector } from "react-redux";
import DateTimePicker from 'react-datetime-picker'
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

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const handleSlotSelect = (slotInfo) => {
		setSelectedSlot(slotInfo);
		setIsBookingModalOpen(true);
	}

	const handleBookingConfirmation = () => {
		

		console.log(selectedSlot.start)
		const date1 = new Date(selectedSlot.start);
		const date2 = new Date(selectedSlot.end);

		const startDateObj = date1.toLocaleString();
		const endDateObj = date2.toLocaleString();


		console.log("hello there");


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
				const booking = response.data;
				console.log(booking);
				setIsBookingModalOpen(false);
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
							onClick={() => handleDeleteFacility(row.original.facilityBookingId)}
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
							onClick={() => handleDeleteFacility(row.original.facilityBookingId)}
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
	const [formData, setFormData] = useState({
		subDepartmentId: null,
		name: "",
		location: "",
		description: "",
		capacity: "",
		facilityStatusEnum: "",
		facilityTypeEnum: "",
	});

	const [selectedFacility, setSelectedFacility] = useState(null);
	const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

	const handleViewAvailability = (facility) => {
		setSelectedFacility(facility);
		setIsCalendarModalOpen(true);

		facilityApi.
			findAllBookingsOfAFacility(facility.facilityId)
			.then((response) => {
				const facilityBookings = response.data;
				console.log(facilityBookings);
				const mappedEvents = facilityBookings.map((booking) => ({
					title: `Booked by ${booking.staffUsername}`,
					facilityBookingId: booking.facilityBookingId,
					comments: booking.comments,
					staffUsername: booking.staffUsername,
					start: new Date(booking.startDateTime),
					end: new Date(booking.endDateTime),
					facilityBookingId: booking.facilityBookingId,
					owner: booking.staffUsername,
					resizable: true,
					draggable: true,

				}));

				setCalendarEvents(mappedEvents);
			}).catch((error) => {
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


	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleDeleteBooking = async (id) => {
		facilityApi
			.deleteFacilityBooking(id)
			.then((response) => {
				const updatedEvents = calendarEvents.filter((event) => event.facilityBookingId !== id);
				setCalendarEvents(updatedEvents);
				setIsBookingDetailsOpen(false);
				reduxDispatch(
					displayMessage({
						color: "success",
						icon: "notification",
						title: "Successfully Deleted Booking!",
					})
				);
			}).catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const handleDeleteFacility = (facilityBookingId) => {
		setBookingToDeleteId(facilityBookingId);
		setDeleteConfirmationOpen(true);
	};

	const handleConfirmDeleteBooking = (facilityBookingId) => {
		try {
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
							content: "Facility with facility Id: " + facilityBookingId + " deleted",
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
		const eventIndex = calendarEvents.findIndex((ev) => ev.id === event.id);

		if (eventIndex !== -1) {
			const date1 = new Date(event.start);
			const date2 = new Date(event.end);

			const startDateObj = date1.toLocaleString();
			const endDateObj = date2.toLocaleString();

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
					.catch((error) => {
						console.error("Error fetching data:", error);
					});
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
	};

	const handleEventDrop = async (event) => {
		const eventIndex = calendarEvents.findIndex((ev) => ev.id === event.id);

		if (eventIndex !== -1) {
			const date1 = new Date(event.start);
			const date2 = new Date(event.end);

			const startDateObj = date1.toLocaleString();
			const endDateObj = date2.toLocaleString();

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
					.catch((error) => {
						console.error("Error fetching data:", error);
					});
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
	};

	const calendarConfig = {
		selectable: true,
		events: calendarEvents,
		defaultView: 'week',
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
											<div>
												<p>Booking ID: {selectedBooking.facilityBookingId}</p>
												<p>Start Time: {moment(selectedBooking.start).format('MMMM Do YYYY, h:mm:ss a')}</p>
												<p>End Time: {moment(selectedBooking.end).format('MMMM Do YYYY, h:mm:ss a')}</p>
												<p>Booked by: {selectedBooking.staffUsername}</p>
												<p>Comments: {selectedBooking.comments}</p>
												{selectedBooking.staffUsername === staff.username && (
													<Button
														variant="contained"
														style={{ backgroundColor: 'red', color: 'white' }}
														onClick={() => handleDeleteBooking(selectedBooking.facilityBookingId)}													>
														Delete Booking
													</Button>
												)}
											</div>
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
										<Button onClick={() => handleConfirmDeleteBooking(bookingToDeleteId)} color="secondary">
											Confirm
										</Button>
									</DialogActions>
								</Dialog>
								
							</MDBox>
						</Card>
					</Grid>
				</Grid>
			</MDBox>

		</DashboardLayout>
	);
}

export default FacilityBooking;
