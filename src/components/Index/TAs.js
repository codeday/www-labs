import { Box, Flex, Grid, Heading, Image, Text } from "@codeday/topo/Atom";
import { useQuery } from "../../providers";
import { Content } from "@codeday/topo/Molecule";


function PersonBox({ person, ...props }) {
  return (
    <Box display="inline-block" textAlign="center" {...props}>
      <Image
        display="inline-block"
        src={person.picture}
        rounded="full"
        width="64px"
        alt=""
        mr={2}
        mt={1}
      />
      <Box>
        <Text
          mb={0}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {person.name}
        </Text>
      </Box>
    </Box>
  );
}


export default function TAs(props) {
  const users = useQuery('account.tas', []);
  return (
    <Content {...props}>
      <Heading as="h3" mb={6} textAlign="center" pl={4} pr={4}>
        If you get stuck, our TAs are always available to help!
      </Heading>
      <Flex justifyContent="center">
        {users.map(p => <PersonBox key={p.picture} person={p} m={6} />)}
      </Flex>
    </Content>
  )
}