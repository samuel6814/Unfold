import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../lib/Firebase';
import Navbar from '../Navbar';
import { Plus, Heart, MessageCircle, Send } from 'lucide-react';

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%); 
  font-family: 'Inter', sans-serif;
  padding: 100px clamp(1.5rem, 5vw, 4rem);
  box-sizing: border-box;
`;

const HubWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 6vw, 2.5rem);
  color: #1a1a1a;
`;

const CreatePostButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  border: none;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover { background-color: #000; }
  &:disabled { background-color: #999; cursor: not-allowed; }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PostCard = styled.div`
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
`;

const PostImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
`;

const PostBody = styled.div`
  padding: 1rem 1.5rem;
`;

const PostContent = styled.p`
  color: #555;
  line-height: 1.7;
  white-space: pre-wrap;
  margin: 0.5rem 0 1rem 0;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #555;
  padding: 0;
  &.supported { color: #E91E63; }
`;

const CommentsSection = styled.div`
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #eee;
`;

const Comment = styled.div`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #333;
  span {
    font-weight: 600;
    margin-right: 0.5rem;
    color: #000;
  }
`;

const CommentForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const CommentInput = styled.input`
  flex-grow: 1;
  border: none;
  background: #f0f0f0;
  padding: 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  &:focus { outline: none; }
`;

// --- Modal Components ---
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;
const ModalContent = styled.div`
  background: #fff; padding: 2rem; border-radius: 15px;
  width: 100%; max-width: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;
const Textarea = styled.textarea`
  width: 100%; min-height: 120px; padding: 0.8rem; border-radius: 8px;
  border: 1px solid #ccc; font-size: 1rem; resize: vertical; box-sizing: border-box;
`;
const FileInputLabel = styled.label`
  display: block; padding: 1rem; border: 2px dashed #ccc; border-radius: 8px;
  text-align: center; cursor: pointer; margin-bottom: 1rem; font-size: 0.9rem; color: #555;
  &:hover { border-color: #333; }
`;
const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 1rem;
`;


// --- Post Component with Comments ---
const Post = ({ post, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!showComments) return;
    const commentsRef = collection(db, 'communityPosts', post.id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, [post.id, showComments]);

  const handleSupportPost = async () => {
    if (!user) return;
    const postRef = doc(db, 'communityPosts', post.id);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const postData = postSnap.data();
      const supports = Array.isArray(postData.supports) ? postData.supports : [];
      const newSupports = supports.includes(user.uid)
        ? supports.filter(uid => uid !== user.uid)
        : [...supports, user.uid];
      await updateDoc(postRef, { supports: newSupports });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '' || !user) return;
    const commentsRef = collection(db, 'communityPosts', post.id, 'comments');
    await addDoc(commentsRef, {
      text: newComment,
      authorId: user.uid,
      createdAt: serverTimestamp(),
    });
    setNewComment("");
  };

  return (
    <PostCard>
      {post.imageUrl && <PostImage src={post.imageUrl} alt="User post" />}
      <PostBody>
        <PostContent>{post.content}</PostContent>
      </PostBody>
      <PostActions>
        <ActionButton className={user && post.supports.includes(user.uid) ? 'supported' : ''} onClick={handleSupportPost}>
          <Heart /> {post.supports.length}
        </ActionButton>
        <ActionButton onClick={() => setShowComments(!showComments)}>
          <MessageCircle /> {comments.length > 0 ? comments.length : ''}
        </ActionButton>
      </PostActions>
      {showComments && (
        <CommentsSection>
          {comments.map(comment => (
            <Comment key={comment.id}><span>Anonymous</span>{comment.text}</Comment>
          ))}
          <CommentForm onSubmit={handleCommentSubmit}>
            <CommentInput type="text" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} />
            <ActionButton as="button" type="submit"><Send /></ActionButton>
          </CommentForm>
        </CommentsSection>
      )}
    </PostCard>
  );
};


// --- Main Community Hub Component ---
const CommunityHub = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(currentUser => setUser(currentUser));
    const postsCollectionRef = collection(db, 'communityPosts');
    const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({
        ...doc.data(), id: doc.id,
        supports: Array.isArray(doc.data().supports) ? doc.data().supports : [] 
      })));
    });
    return () => { unsubscribeAuth(); unsubscribePosts(); };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewPostContent('');
    setNewPostImage(null);
    setImagePreviewUrl('');
    setIsUploading(false); // Also reset uploading state
  };

  const handleSubmitPost = async () => {
    if ((newPostContent.trim() === '' && !newPostImage) || !user) return;
    
    setIsUploading(true);
    
    let imageUrl = '';
    try {
      if (newPostImage) {
        const imageRef = ref(storage, `communityImages/${user.uid}_${Date.now()}`);
        await uploadBytes(imageRef, newPostImage);
        imageUrl = await getDownloadURL(imageRef);
      }
      
      await addDoc(collection(db, 'communityPosts'), {
        content: newPostContent,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        supports: [],
        imageUrl: imageUrl,
      });
      
      handleCloseModal();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <HubWrapper>
          <Header>
            <Title>Anonymous Hub</Title>
            <CreatePostButton onClick={() => setIsModalOpen(true)}>
              <Plus size={20} /> New Post
            </CreatePostButton>
          </Header>
          <PostList>
            {posts.map(post => <Post key={post.id} post={post} user={user} />)}
          </PostList>
        </HubWrapper>
      </PageContainer>

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>Create a New Post</h2>
            
            {imagePreviewUrl && <ImagePreview src={imagePreviewUrl} alt="Preview" />}

            <HiddenFileInput id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />
            <FileInputLabel htmlFor="file-upload">
              {newPostImage ? newPostImage.name : 'Click to add an image'}
            </FileInputLabel>

            <Textarea placeholder="Share your story..." value={newPostContent} onChange={e => setNewPostContent(e.target.value)} />
            
            <CreatePostButton onClick={handleSubmitPost} disabled={isUploading} style={{float: 'right', marginTop: '1rem'}}>
              {isUploading ? 'Posting...' : 'Submit'}
            </CreatePostButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default CommunityHub;

