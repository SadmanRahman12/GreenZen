import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { blogData } from './blogData';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  console.log('Post ID from URL:', id);
  const post = blogData.find(post => post.id === parseInt(id));
  console.log('Found post:', post);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="blog-post-section py-5">
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <h1 className="text-center mb-4">{post.title}</h1>
            <div className="text-center mb-4">
              <span className="text-muted">By {post.author} on {post.date}</span>
            </div>
            <Image src={post.image} fluid className="mb-4" />
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogPost;
