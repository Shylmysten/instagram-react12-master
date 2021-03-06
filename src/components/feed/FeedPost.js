import React from "react";
import { useFeedPostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import { CommentIcon, LikeIcon, MoreIcon, RemoveIcon, SaveIcon, ShareIcon, UnlikeIcon } from "../../icons";
import { Link } from 'react-router-dom';
import { Button, Divider, Hidden, TextField, Typography } from "@material-ui/core";
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import FollowSuggestions from '../shared/FollowSuggestions';
import OptionsDialog from '../shared/OptionsDialog';

function FeedPost({ post, index }) {
  const classes = useFeedPostStyles();
  const [showCaption, setCaption] = React.useState();
  const [showOptionsDialog, setOptionsDialog] = React.useState(false);
  const { id, media, likes, user, caption, comments } = post;
  const showFollowSuggestions = index === 1;

  return (
    <>
      <article className={classes.article}
        style={{ marginBottom: showFollowSuggestions && 30 }}
      >
        {/* Feed Post Header */}
        <div className={classes.postHeader}>
          <UserCard user={user}/>
          <MoreIcon className={classes.MoreIcon} onClick={() => setOptionsDialog(true)}/>
        </div>
        {/* Feed Post Image */}
        <div>
          <img src={media} alt="Post media" className={classes.image} />
        </div>
        {/* Feed Post buttons */}
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
              <LikeButton />
              <Link to={`/p/${id}`}>
                <CommentIcon />
              </Link>
              <ShareIcon />
              <SaveButton />
          </div>
          <Typography className={classes.likes} variant="subtitle2">
            <span>{likes === 1 ? '1 like' : `${likes} likes`}</span>
          </Typography>
          <div className={showCaption ? classes.expanded : classes.collapsed}>
            <Link to={`/${user.username}`}>
              <Typography variant="subtitle2" component="span" className={classes.username}>
                {user.username}
              </Typography>
            </Link>
            {showCaption ? (
              <Typography variant="body2" component="span" dangerouslySetInnerHTML={{ __html: caption }}/>
            ) : (
              <div className={classes.captionWrapper}>
                <HTMLEllipsis 
                  unsafeHTML={caption}
                  className={classes.caption}
                  maxLine="0"
                  ellipsis="..."
                  basedOn="letters"
                />
                <Button 
                className={classes.moreButton}
                onClick={() => setCaption(true)}>
                    more
                </Button>
              </div>
            )}
          </div>
          <Link to={`p/${id}`}>
            <Typography className={classes.commentsLink}
            variant="body2"
            component="div"
            >
              View all {comments.length} comments
            </Typography>
          </Link>
          {comments.map(comment => (
            <div key={comment.id}>
              <Link to={`/${comment.user.username}`}>
                <Typography
                  variant="subtitle2"
                  component="span"
                  className={classes.commentUsername}
                >
                  {comment.user.username}
                </Typography>{" "}
                <Typography 
                  variant="body2"
                  component="span"
                >
                  {comment.content}
                </Typography>
              </Link>
            </div>
          ))}
          <Typography 
            color="textSecondary"
            className={classes.datePosted}
          >
            5 DAYS AGO
          </Typography>
        </div>
        <Hidden xsDown>
            <Divider />
            <Comment />
        </Hidden>
      </article>
      {showFollowSuggestions && <FollowSuggestions />}
      {showOptionsDialog && <OptionsDialog  onClose={() => setOptionsDialog(false)}/>}
    </>
  );
}

function LikeButton() {
  const classes = useFeedPostStyles();
  const [liked, setLiked] = React.useState(false);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const onClick = liked ? handleUnlike : handleLike;

  function handleLike() {
    console.log('like');
    setLiked(true);
  }

  function handleUnlike() {
    console.log('unlike');
    setLiked(false);
  }

  return <Icon className={className} onClick={onClick} />
}

function SaveButton() {
  const classes = useFeedPostStyles();
  const [saved, setSaved] = React.useState(false);
  const Icon = saved ? RemoveIcon : SaveIcon;
  const onClick = saved ?  handleRemove : handleSave;

  function handleSave() {
    console.log('saved');
    setSaved(true);
  }

  function handleRemove() {
    console.log('removed');
    setSaved(false);
  }

  return <Icon className={classes.saveIcon} onClick={onClick} />
}

function Comment() {
  const classes = useFeedPostStyles();
  const [content, setContent] = React.useState('');



  return (
    <div className={classes.commentContainer}>
      <TextField
        fullWidth
        value={content}
        placeholder="Add a comment..."
        multiline
        rowsMax={2}
        rows={1}
        onChange={event => setContent(event.target.value)}
        className={classes.textField}
        InputProps={{
          classes: {
            root: classes.root,
            underline: classes.underline
          }
        }}
      />
      <Button
        color="primary"
        className={classes.commentButton}
        disabled={!content.trim()}
      >
        Post
      </Button>
    </div>
  )
}

export default FeedPost;
