import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Avatar,
} from '@chakra-ui/react';
const ProjectCard = () => {
  return (
    <>
      <Card align="center">
        <div className="flex item-center justify-between">
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
        </div>
      </Card>
    </>
  );
};

export default ProjectCard;
