import {
	Grid,
	Card,
	CardContent,
	Typography,
	Chip,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	CardMedia,
	Icon,
	Stepper, Step, StepLabel,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Input
} from '@mui/material';
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";
import { postApi, imageServerApi } from 'api/Api';
import { displayMessage } from "store/slices/snackbarSlice";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import moment from "moment";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


function KnowledgeManagement() {
	const reduxDispatch = useDispatch();
	const loggedInStaff = useSelector(selectStaff);
	const [posts, setPosts] = useState([]);
	const [postCreators, setPostCreators] = useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [postType, setPostType] = useState('');
	const [image, setImage] = useState(null);

	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	const [activeStep, setActiveStep] = useState(0);


	const handleViewPost = (post) => {
		setSelectedPost(post);
		setIsViewModalOpen(true);
	};

	const handleCloseViewDialog = () => {
		setIsViewModalOpen(false);
		setSelectedPost(null);
		setActiveStep(0);
	};

	const handleStepChange = (step) => {
		setActiveStep(step);
	};

	const handlePhotoUpload = (e) => {
		console.log(e.target.files[0]);
		const formData = new FormData();
		formData.append("image", e.target.files[0], e.target.files[0].name);
		setImage(formData);
	};

	

	const handleGetPostCreator = async (postId) => {
		try {
			const response = await postApi.findPostAuthor(postId);
			const creator = response.data;
			console.log(response.data)
			setPostCreators((prev) => ({ ...prev, [postId]: creator }));

		} catch (error) {
			console.error('Error fetching post creator:', error);
		}
	};

	useEffect(() => {
		posts.forEach((post) => {
			handleGetPostCreator(post.postId);
			if (post.listOfImageDocuments.length > 0) {
				handleGetProfileImage(post.listOfImageDocuments[0].imageLink, post.postId);
			}
		});
	}, [posts]);

	useEffect(() => {
		fetchData();
	}, []);

	const getChipColor = (postType) => {
		switch (postType) {
			case 'ADMINISTRATIVE':
				return 'primary';
			case 'RESEARCH':
				return 'secondary';
			case 'ENRICHMENT':
				return 'success';
			default:
				return 'default';
		}
	};

	const formatDate = (timestampArray) => {
		const year = timestampArray[0];
		const month = (timestampArray[1] + 1).toString().padStart(2, '0'); // Months are zero-based
		const day = timestampArray[2].toString().padStart(2, '0');
		return `${day}/${month}/${year}`;
	};


	const fetchData = async () => {
		try {
			const response = await postApi.getAllPosts();
			const posts = response.data;
			setPosts(posts);
			console.log(posts);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const [imageURLs, setImageURLs] = useState({});



	const handleGetProfileImage = async (listOfImageDocuments, postId) => {
		try {
			const imageURLs = [];
			for (const imageDocument of listOfImageDocuments) {
				const response = await imageServerApi.getImageFromImageServer("id", imageDocument.imageLink);
				const imageURL = URL.createObjectURL(response.data);
				imageURLs.push(imageURL);
			}
			setImageURLs((prev) => ({ ...prev, [postId]: imageURLs }));
		} catch (error) {
			console.error("Error fetching image:", error);
		}
	};


	const handleCloseModal = () => {
		setTitle('');
		setBody('');
		setPostType('');
		setImage(null);
		setIsModalOpen(false);
	};

	useEffect(() => {
		posts.forEach((post) => {
			if (post.listOfImageDocuments.length > 0) {
				handleGetProfileImage(post.listOfImageDocuments, post.postId);
			}
		});
	}, [posts]);

	// 

	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox pt={6} pb={3}>
				<Card sx={{ backgroundColor: 'white' }}>
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
							Knowledge Management
						</MDTypography>
					</MDBox>
					
					<CardContent>
						<Grid container spacing={2}>
							{posts.map((post) => (
								<Grid item xs={12} sm={6} key={post.postId}>
									<Card sx={{ height: '100%' }} style={{ display: 'flex', flexDirection: 'column' }}>
										<CardContent>
											<Typography gutterBottom variant="h5" component="div">
												{post.title}
											</Typography>

											<Typography variant="subtitle2" color="text.secondary" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
												Post Type:
												<Chip
													label={post.postTypeEnum}
													color={getChipColor(post.postTypeEnum)}
													variant="outlined"
												/>
											</Typography>

											<Typography variant="subtitle2" color="text.secondary" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
												Created on: {formatDate(post.createdDate)}
											</Typography>

											<Typography variant="subtitle2" color="text.secondary" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
												Author:
												{postCreators[post.postId]
													? ' ' + postCreators[post.postId].firstname + ' ' + postCreators[post.postId].lastname
													: ''}
											</Typography>
											<Box pt={2} display="flex" justifyContent="center">
												{imageURLs[post.postId] && imageURLs[post.postId].length > 0 && (
													<CardMedia
														component="img"
														image={imageURLs[post.postId][0]}
														alt={`Image 0`}
														style={{ width: '100%', height: 'auto' }}
													/>
												)}
											</Box>
											<Box mt="auto"> {/* Pushes the following content to the bottom */}
                                                                                        <Box display="flex" justifyContent="flex-end" pt={2} marginBottom={"30px"} marginRight={"20px"}>
                                                                                                <Button variant="outlined" color="primary" onClick={() => handleViewPost(post)} style={{ backgroundColor: 'blue' }}>
                                                                                                        View
                                                                                                </Button>
                                                                                                
                                                                                        </Box>
                                                                                </Box>

										</CardContent>
										
									</Card>
								</Grid>
							))}
						</Grid>
					</CardContent>
				</Card>
			</MDBox>
			
			{isViewModalOpen && selectedPost && (
				<Dialog open={isViewModalOpen} onClose={handleCloseViewDialog} fullWidth maxWidth="md">
					<DialogTitle>{selectedPost.title}</DialogTitle>
					<DialogContent>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Stepper activeStep={activeStep} alternativeLabel>
									{selectedPost.listOfImageDocuments.map((image, index) => (
										<Step key={index}>
											<StepLabel>
												<a href={imageURLs[selectedPost.postId][index]} target="_blank" rel="noopener noreferrer">
													{`Click to view Image ${index + 1}`}
												</a>
											</StepLabel>
										</Step>
									))}
								</Stepper>
								{selectedPost.listOfImageDocuments.length > 0 && (
									<Box>
										<Button disabled={activeStep === 0} onClick={() => handleStepChange(activeStep - 1)}>
											Back
										</Button>
										<Button
											disabled={activeStep === selectedPost.listOfImageDocuments.length - 1}
											onClick={() => handleStepChange(activeStep + 1)}
										>
											Next
										</Button>
									</Box>
								)}
							</Grid>
							<Grid item xs={12}>
								<img
									src={imageURLs[selectedPost.postId][activeStep]}
									alt={selectedPost.listOfImageDocuments[activeStep].imageLink}
									style={{ width: '100%', height: 'auto' }}
								/>
							</Grid>
							<Grid item xs={12}>

								<Typography variant="subtitle2" color="text.secondary" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
									Post Type:
									<Chip
										label={selectedPost.postTypeEnum}
										color={getChipColor(selectedPost.postTypeEnum)}
										variant="outlined"
									/>
								</Typography>
								<Typography variant="subtitle2" color="text.secondary" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
									Author:
									{postCreators[selectedPost.postId]
										? ' ' + postCreators[selectedPost.postId].firstname + ' ' + postCreators[selectedPost.postId].lastname
										: ''}
								</Typography>

								<Typography variant="body1" color="text.secondary" gutterBottom style={{ fontSize: '1.4rem', lineHeight: '1.6', marginTop: '1rem' }}>
									{selectedPost.body}
								</Typography>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseViewDialog}>Close</Button>
					</DialogActions>
				</Dialog>
			)}
			

		</DashboardLayout>

	);


}

export default KnowledgeManagement;
