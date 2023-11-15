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
import { TextareaAutosize } from '@mui/base';




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

	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [updateTitle, setUpdateTitle] = useState('');
	const [updateBody, setUpdateBody] = useState('');
	const [updatePostType, setUpdatePostType] = useState('');
	const [updateImages, setUpdateImages] = useState([]);
	const [updateImageURLs, setUpdateImageURLs] = useState([]);
	const [updateImagePost, setUpdateImagePost] = useState([]);
	const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

	const handleOpenImageDialog = (post) => {
		setIsImageDialogOpen(true);
		setUpdateImagePost(post);
		setUpdateImages([...post.listOfImageDocuments]);

	};

	const handleCloseImageDialog = () => {
		setIsImageDialogOpen(false);
	};


	const handleOpenUpdateDialog = (post) => {
		setSelectedPost(post);
		setUpdateTitle(post.title);
		setUpdateBody(post.body);
		setUpdatePostType(post.postTypeEnum);
		setIsUpdateModalOpen(true);
	};

	const handleCloseUpdateDialog = () => {
		setIsUpdateModalOpen(false);
	};

	const handleUpdatePost = async () => {
		const requestBody = {
			title: updateTitle,
			body: updateBody,
			postType: updatePostType,
		};

		try {
			const response = await postApi.updatePost(selectedPost.postId, requestBody);
			fetchData();
			reduxDispatch(
				displayMessage({
					color: "success",
					icon: "notification",
					title: "Success",
					content: "Post Updated Successfully!",
				})
			);
		} catch (error) {
			reduxDispatch(
				displayMessage({
					color: "error",
					icon: "notification",
					title: "Error",
					content: error.response.data,
				})
			);
			console.error('Error updating post:', error);
		}

		handleCloseUpdateDialog();
	};

	const handleUpdatePhotoUpload = async (e) => {
		try {
			const formData = new FormData();
			formData.append("image", e.target.files[0], e.target.files[0].name);
			const response = await imageServerApi.uploadProfilePhoto("id", formData);

			console.log("Response:", response); // Add this line

			// Check if the response has a 'data' property before accessing it
			if (response && response.data) {
				let imageLink = response.data.filename;

				const requestBody = {
					image: imageLink,
				};

				const addImage = await postApi.addImageToPost(updateImagePost.postId, requestBody)
				// const imageURL = URL.createObjectURL(response.data);
				// setUpdateImageURLs((prevImages) => [...prevImages, imageURL]);

				fetchData();
				handleCloseImageDialog();
				reduxDispatch(
					displayMessage({
						color: "success",
						icon: "notification",
						title: "Success",
						content: "Photo Added Successfully!",
					})
				);
			} else {
				console.error('Error uploading image. Response:', response);
			}

		} catch (error) {
			reduxDispatch(
				displayMessage({
					color: "error",
					icon: "notification",
					title: "Error",
					content: error.response.data,
				})
			);
			console.error('Error uploading image:', error);
		}
	};


	// Function to handle deleting images in the update dialog
	const handleDeleteUpdateImage = async (index) => {

		if (updateImages.length <= 1) {
			// Throw an error or handle it according to your requirements
			reduxDispatch(
				displayMessage({
					color: "error",
					icon: "notification",
					title: "Post requires at least one Image!",
				})
			);
			return;
		}

		try {
			const deletedImage = updateImages[index];
			const requestBody = {
				imageLink: deletedImage.imageLink,

			};

			const response = await postApi.removeImage(updateImagePost.postId, requestBody);

			fetchData();
			handleCloseImageDialog();
			reduxDispatch(
				displayMessage({
					color: "success",
					icon: "notification",
					title: "Success",
					content: "Photo Deleted Successfully!",
				})
			);


		} catch (error) {
			reduxDispatch(
				displayMessage({
					color: "error",
					icon: "notification",
					title: "Error",
					content: error.response.data,
				})
			);
			console.error('Error deleting image:', error);
		}
		// const updatedImages = updateImages.filter((_, i) => i !== index);
		// setUpdateImages(updatedImages);
	};

	const handleCloseUpdateModal = () => {
		setIsUpdateModalOpen(false);
		setSelectedPost(null);
		setActiveStep(0);
		setUpdateTitle('');
		setUpdateBody('');
		setUpdatePostType('');
		setUpdateImages([]);
	};


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

	const handleCreateNewPost = async () => {

		let imageLink = null;
		let createdDate = null;

		if (image) {
			// Only make the image server request if leavePhoto is provided
			const imageServerResponse = await imageServerApi.uploadProfilePhoto(
				"id",
				image
			);

			imageLink = imageServerResponse.data.filename; // Set imageLink if photo is uploaded
			createdDate = moment().format("YYYY-MM-DDTHH:mm:ss");
		}

		const requestBody = {
			title: title,
			body: body,
			postType: postType,
			image: imageLink,
		};

		try {
			console.log(requestBody)
			const response = await postApi.createPost(loggedInStaff.staffId, requestBody);
			const post = response.data;

			fetchData();
			reduxDispatch(
				displayMessage({
					color: 'success',
					icon: 'notification',
					title: 'Successfully Created Post!',
				})
			);

		} catch (error) {
			console.error('Error creating post :', error);
		}
		handleCloseModal();
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
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedPostId, setSelectedPostId] = useState(null);

	const handleOpenDialog = (postId) => {
		setSelectedPostId(postId);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleDeletePost = async (postId) => {
		try {
			await postApi.deletePost(postId);
			fetchData(); // Refresh the post list
			reduxDispatch(
				displayMessage({
					color: 'success',
					icon: 'notification',
					title: 'Successfully Deleted Post!',
				})
			);
		} catch (error) {
			console.error('Error deleting post:', error);
		}
		setOpenDialog(false);
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

	// const handleGetProfileImage = async (profilePicture, postId) => {
	// 	try {
	// 		const response = await imageServerApi.getImageFromImageServer(
	// 			"id",
	// 			profilePicture
	// 		);
	// 		const imageURL = URL.createObjectURL(response.data);
	// 		setImageURLs((prev) => ({ ...prev, [postId]: imageURL }));
	// 	} catch (error) {
	// 		console.error('Error fetching image:', error);
	// 	}
	// };

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

	useEffect(() => {
		const fetchUpdateImageURLs = async () => {
			const urls = [];
			for (const imageDocument of updateImages) {
				try {
					const response = await imageServerApi.getImageFromImageServer("id", imageDocument.imageLink);
					const imageURL = URL.createObjectURL(response.data);
					urls.push(imageURL);
				} catch (error) {
					console.error('Error fetching image:', error);
				}
			}
			setUpdateImageURLs(urls);
		};
		fetchUpdateImageURLs();
	}, [updateImages]);

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
					<MDBox mx={2} mt={3} px={2}>
						<MDButton
							Button
							variant="contained"
							color="primary"
							onClick={() => setIsModalOpen(true)}
						>
							Create New Post
							<Icon>add</Icon>
						</MDButton>
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
														style={{ width: '100%', height: '700px', objectFit: 'cover' }} // Adjust the height as needed
													/>
												)}
											</Box>

										</CardContent>
										<Box mt="auto"> {/* Pushes the following content to the bottom */}
											<Box display="flex" justifyContent="flex-end" pt={2} marginBottom={"30px"} marginRight={"20px"}>
												<Button variant="outlined" color="primary" onClick={() => handleViewPost(post)} style={{ backgroundColor: 'blue' }}>
													View
												</Button>
												{postCreators[post.postId] && loggedInStaff && postCreators[post.postId].staffId === loggedInStaff.staffId && (
													<>
														<Button variant="contained" style={{ backgroundColor: 'green', color: 'white', marginLeft: 10 }} onClick={() => handleOpenUpdateDialog(post)}>
															Edit Post
														</Button>
														<Button variant="contained" style={{ backgroundColor: 'green', color: 'white', marginLeft: 10 }} onClick={() => handleOpenImageDialog(post)}>
															Edit Images
														</Button>
														<Button variant="contained" style={{ backgroundColor: 'red', color: 'white', marginLeft: 10 }} onClick={() => handleOpenDialog(post.postId)}>
															Delete
														</Button>
													</>
												)}
											</Box>
										</Box>
									</Card>
								</Grid>
							))}
						</Grid>
					</CardContent>
				</Card>
			</MDBox>
			<Dialog open={openDialog} onClose={handleCloseDialog} >
				<DialogTitle>Delete Post</DialogTitle>
				<DialogContent>Are you sure you want to delete this post?</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button onClick={() => handleDeletePost(selectedPostId)} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={isModalOpen}
				onClose={handleCloseModal}
				fullWidth
				maxWidth="lg"
				PaperProps={{
					style: {
						width: '100%',
						maxHeight: '80vh',
					},
				}}
			>
				<DialogTitle>Create New Post</DialogTitle>
				<DialogContent dividers>
					<TextField
						autoFocus
						margin="dense"
						id="title"
						label="Title"
						type="text"
						fullWidth
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						multiline
						rows={2}
					/>
					<TextareaAutosize
						id="body"
						aria-label="Body"
						placeholder="Body"
						minRows={4}
						maxRows={10}
						style={{
							width: '100%',
							padding: '12px',
							marginBottom: '16px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							resize: 'vertical', // Allow vertical resizing
							fontFamily: 'inherit', // Use the same font as other components
						}}
						value={body}
						onChange={(e) => setBody(e.target.value)}
					/>
					<InputLabel id="post-type-label">Post Type</InputLabel>
					<Select
						labelId="post-type-label"
						id="post-type"
						value={postType}
						label="Post Type"
						onChange={(e) => setPostType(e.target.value)}
						fullWidth
					>
						<MenuItem value="ADMINISTRATIVE">ADMINISTRATIVE</MenuItem>
						<MenuItem value="RESEARCH">RESEARCH</MenuItem>
						<MenuItem value="ENRICHMENT">ENRICHMENT</MenuItem>
					</Select>
					<Grid item xs={6}>
						<MDBox>
							<MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
								Upload Photo
							</MDTypography>
							<br />
							<input type="file" accept="image/*" onChange={handlePhotoUpload} />
							<br />
						</MDBox>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal}>Cancel</Button>
					<Button onClick={handleCreateNewPost} color="primary">
						Create
					</Button>
				</DialogActions>
			</Dialog>


			{isViewModalOpen && selectedPost && (
				<Dialog open={isViewModalOpen} onClose={handleCloseViewDialog} fullWidth maxWidth="md">
					<DialogTitle>{selectedPost.title}</DialogTitle>
					<DialogContent>
						<Grid container spacing={2}>

							<Grid item xs={12}>
								<img
									src={imageURLs[selectedPost.postId][activeStep]}
									alt={selectedPost.listOfImageDocuments[activeStep].imageLink}
									style={{ width: '100%', height: 'auto' }}
								/>
							</Grid>
							<Grid item xs={12}>
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
								{/* {selectedPost.listOfImageDocuments.length > 0 && (
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
								)} */}
							</Grid>
							<Grid item xs={12}>
								<Card variant="outlined">
									<CardContent>
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
											{selectedPost.body.split('\n').map((paragraph, index) => (
												<React.Fragment key={index}>
													{index > 0 && <br />} {/* Add <br> between paragraphs, excluding the first one */}
													{paragraph}
												</React.Fragment>
											))}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseViewDialog}>Close</Button>
					</DialogActions>
				</Dialog>
			)}
			<Dialog open={isUpdateModalOpen} onClose={handleCloseUpdateModal}
				fullWidth
				maxWidth="lg"
				PaperProps={{
					style: {
						width: '100%',
						maxHeight: '80vh',
					},
				}}>
				<DialogTitle>Update Post</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="update-title"
						label="Title"
						type="text"
						fullWidth
						value={updateTitle}
						onChange={(e) => setUpdateTitle(e.target.value)}
					/>
					<TextareaAutosize
						id="body"
						aria-label="Body"
						placeholder="Body"
						minRows={4}
						maxRows={10}
						style={{
							width: '100%',
							padding: '12px',
							marginBottom: '16px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							resize: 'vertical', // Allow vertical resizing
							fontFamily: 'inherit', // Use the same font as other components
						}}
						value={updateBody}
						onChange={(e) => setUpdateBody(e.target.value)}
					/>
					{/* <TextField
						margin="dense"
						id="update-body"
						label="Body"
						multiline
						rows={4}
						fullWidth
						value={updateBody}
						onChange={(e) => setUpdateBody(e.target.value)}
					/> */}
					<InputLabel id="update-post-type-label">Post Type</InputLabel>
					<Select
						labelId="update-post-type-label"
						id="update-post-type"
						value={updatePostType}
						label="Post Type"
						onChange={(e) => setUpdatePostType(e.target.value)}
						fullWidth
					>
						<MenuItem value="ADMINISTRATIVE">ADMINISTRATIVE</MenuItem>
						<MenuItem value="RESEARCH">RESEARCH</MenuItem>
						<MenuItem value="ENRICHMENT">ENRICHMENT</MenuItem>
					</Select>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseUpdateModal}>Cancel</Button>
					<Button onClick={handleUpdatePost} color="primary">
						Update
					</Button>
				</DialogActions>
			</Dialog>


			<Dialog
				open={isImageDialogOpen}
				onClose={handleCloseImageDialog}
				fullWidth
				maxWidth="xl"
				PaperProps={{
					style: {
						maxHeight: '90vh',
						height: '100%',
					},
				}}
			>
				<DialogTitle>Manage Images</DialogTitle>
				<DialogContent>
					<FormControl fullWidth style={{ textAlign: 'left', marginTop: 10, marginBottom: 10 }}>
						<Input
							id="update-image"
							type="file"
							accept="image/*"
							onChange={handleUpdatePhotoUpload}
							style={{ display: 'none' }}
						/>
						<label htmlFor="update-image">
							<Button component="span" variant="contained" color="primary" style={{ backgroundColor: 'blue', color: 'white' }}>
								Add Image
							</Button>
						</label>
					</FormControl>
					{updateImageURLs.length > 0 && (
						<Grid container spacing={2} style={{ justifyContent: 'center' }}>
							{updateImageURLs.map((image, index) => (
								<Grid item key={index} xs={12}>
									<Card>
										<CardContent style={{ textAlign: 'center' }}>
											<Typography variant="h4" gutterBottom>{`Image ${index + 1}`}</Typography>
											<a href={image} target="_blank" rel="noopener noreferrer">
												<CardMedia
													component="img"
													alt={`Image ${index}`}
													src={image}
													style={{ width: '100%', height: '100%', objectFit: 'cover' }}
												/>
											</a>
											<Button
												onClick={() => handleDeleteUpdateImage(index)}
												variant="contained"
												style={{ backgroundColor: 'red', color: 'white', marginTop: 10, alignSelf: 'center' }}
											>
												Delete
											</Button>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					)}

				</DialogContent>
			</Dialog>


		</DashboardLayout>

	);


}

export default KnowledgeManagement;