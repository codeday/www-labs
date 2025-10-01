import {
  Box,
  Checkbox,
  Code,
  Grid,
  Heading,
  HStack,
  Link,
  List,
  ListItem,
  Spinner,
  Text,
  TextInput,
  Button
} from "@codeday/topo/Atom";
import { apiFetch } from "@codeday/topo/utils";
import UiX from "@codeday/topocons/Icon/UiX";
import Email from "@codeday/topocons/Icon/Email";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  UniversalSearchQuery,
  DetailsFromStudentIdQuery,
  DetailsFromMentorIdQuery,
  DetailsFromProjectIdQuery,
} from "./UniversalSearch.gql";

function AutocompleteResultName({ result, ...props }) {
  const typeName = result.type[0] + result.type.slice(1).toLowerCase();
  const color = {
    STUDENT: "green",
    MENTOR: "purple",
    PROJECT: "blue",
  }[result.type];
  return (
    <Box {...props}>
      <HStack spacing={1}>
        <Box
          display="inline-block"
          rounded="sm"
          bgColor={`${color}.500`}
          color={`${color}.50`}
          fontSize="0.7em"
          mr={1}
          px={1}
        >
          {typeName}
        </Box>
        <Box
          display="inline-block"
          rounded="sm"
          bgColor={`gray.500`}
          color={`gray.50`}
          fontSize="0.7em"
          mr={1}
          px={1}
        >
          {result.eventId}
        </Box>
      </HStack>
      {result.name}
    </Box>
  );
}

function StudentTrackBadge({ track, ...props }) {
  const color = {
    BEGINNER: "green",
    INTERMEDIATE: "yellow",
    ADVANCED: "orange",
  }[track];
  return (
    <Box
      display="inline-block"
      rounded="sm"
      bgColor={`${color}.500`}
      color={`${color}.50`}
      fontSize="0.7em"
      m={1}
      px={1}
      {...props}
    >
      {track}
    </Box>
  );
}

const nl2br = (str) =>
  str &&
  str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /(https?:\/\/[^\s\(\)]+)/g,
      (url) =>
        `<a href="${url}" style="text-decoration: underline" target="_blank">${url}</a>`
    )
    .replace(/\n/g, "<br />");

export function AutocompleteResultDetails({
  token,
  resultId,
  resultType,
  ...props
}) {
  const [results, setResults] = useState({});
  useEffect(() => {
    (async () => {
      try {
        if (resultType === "STUDENT") {
          const result = await apiFetch(
            DetailsFromStudentIdQuery,
            { id: resultId },
            { "X-Labs-Authorization": `Bearer ${token}` }
          );
          setResults(result?.labs?.student?.projects);
        } else if (resultType === "MENTOR") {
          const result = await apiFetch(
            DetailsFromMentorIdQuery,
            { id: resultId },
            { "X-Labs-Authorization": `Bearer ${token}` }
          );
          setResults(result?.labs?.mentor?.projects);
        } else if (resultType === "PROJECT") {
          const result = await apiFetch(
            DetailsFromProjectIdQuery,
            { id: resultId },
            { "X-Labs-Authorization": `Bearer ${token}` }
          );
          setResults(result?.labs?.projects);
        }
      } catch (ex) {
        console.error(ex);
        setResults(null);
      }
    })();
  }, [resultId, resultType]);

  return (
    <Box {...props}>
      {Object.values(results).map((p) => (
        <Box key={p.id} borderWidth={1} mb={2} p={2} rounded="sm">
          <Box>
            <Text fontWeight="bold" display="inline">
              Mentor{p.mentors.length > 0 ? "s" : ""}:{" "}
            </Text>
            {p.mentors.map((m, i) => (
              <>
                <Link key={m.id} href={`dash/mm/${token}/${m.id}`}>
                  {m.name}
                </Link>
                {m.profile.pronouns && <> ({m.profile.pronouns})</>}

                {i + 1 < p.mentors.length ? ", " : ""}
              </>
            ))}
          </Box>

          <Box mt={2}>
            <Text fontWeight="bold" display="inline">
              Student{p.students.length > 0 ? "s" : ""}:{" "}
            </Text>
            {p.students.map((s, i) => (
              <Box key={s.id}>
                <Text display="inline">{s.name}</Text>
                &nbsp;
                <Button h="1em" px={1} as="a" href={`mailto:${s.email}`}><Email /></Button>
                {s.profile.pronouns && <> ({s.profile.pronouns})</>}
                {s.track && <StudentTrackBadge track={s.track} />}
                {s.partnerCode && (
                  <Box
                    display="inline-block"
                    rounded="sm"
                    bgColor={`blue.500`}
                    color={`blue.50`}
                    fontSize="0.7em"
                    m={1}
                    px={1}
                  >
                    {s.partnerCode}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
          <Box mt={2}>
            <Text fontWeight="bold" display="inline">
              Tags:{" "}
            </Text>
            {p.tags.map((t) => t.mentorDisplayName).join(", ")}
          </Box>
          {p.issueUrl && (
            <Box mt={2}>
              <Text fontWeight="bold">Issue URL:</Text>
              <Link href={p.issueUrl}>{p.issueUrl}</Link>
            </Box>
          )}
          <Box mt={2}>
            <Text fontWeight="bold">Description:</Text>
            <div dangerouslySetInnerHTML={{ __html: nl2br(p.description) }} />
          </Box>

          <Box mt={2}>
            <Text fontWeight="bold">Description:</Text>
            <div dangerouslySetInnerHTML={{ __html: nl2br(p.description) }} />
          </Box>

          {p.deliverables && (
            <Box mt={2}>
              <Text fontWeight="bold">Deliverables:</Text>
              <div
                dangerouslySetInnerHTML={{ __html: nl2br(p.deliverables) }}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default function UniversalSearch({
  data,
  students = true,
  mentors = true,
  projects = true,
  onChange,
  ...props
}) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, updateSelected] = useReducer((prev, [action, el]) => {
    if (action === "add") return [el];
    if (action == "remove") return [];
    if (action === "remove") return prev.filter((e) => e.id !== el);
  }, []);
  let token = undefined;
  if (data?.events && Object.keys(data.events).length > 0) {
    // use presence of mm token to confirm admin
    // can pick permissioned token for any event since `autocomplete` query doesn't care with universal = true
    token = Object.entries(data.events)[0][1].mm;
  }
  if (!token) return <></>;

  const tokensById = Object.fromEntries(
    Object.entries(data.events).map(([_name, tokens]) => [
      tokens._id,
      tokens.a || tokens.mm,
    ])
  );

  useEffect(() => {
    if (q.length < 3) {
      setResults([]);
      return () => {};
    }
    setLoading(true);
    const makeRequest = setTimeout(async () => {
      const result = await apiFetch(
        UniversalSearchQuery,
        { q, students, mentors, projects },
        { "X-Labs-Authorization": `Bearer ${token}` }
      );
      setLoading(false);
      setResults(result.labs.autocomplete);
    }, 500);
    return () => clearTimeout(makeRequest);
  }, [q]);

  useEffect(() => onChange && onChange(selected), [selected, onChange]);

  const searchFor = useMemo(
    () =>
      [
        ["students", students],
        ["mentors", mentors],
        ["projects", projects],
      ]
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join("/"),
    [students, mentors, projects]
  );

  const selectedIds = useMemo(() => selected.map((s) => s.id), [selected]);

  return (
    <Box mb={2} {...props}>
      <TextInput
        placeholder={`Search for ${searchFor}`}
        onChange={(e) => setQ(e.target.value)}
        value={q}
        borderBottomRadius={0}
      />
      <Grid
        pt={4}
        borderLeftWidth={1}
        borderRightWidth={1}
        borderBottomWidth={1}
        rounded="sm"
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
        p={4}
      >
        <Box>
          <Heading as="h4" fontSize="sm">
            Search Results:
          </Heading>
          {loading ? (
            <Spinner />
          ) : results.length === 0 ? (
            <Text color="gray.500">No results.</Text>
          ) : (
            <>
              {results.map((r) => (
                <Checkbox
                  key={r.id}
                  value={r.id}
                  onChange={(e) => {
                    if (e.target.checked)
                      updateSelected([
                        "add",
                        results.filter((e) => r.id === e.id)[0],
                      ]);
                    else updateSelected(["remove", r.id]);
                  }}
                  isChecked={selectedIds.includes(r.id)}
                >
                  <AutocompleteResultName result={r} />
                </Checkbox>
              ))}
            </>
          )}
        </Box>
        <Box>
          <List>
            {selected.length === 0 && (
              <Text color="gray.500">Select a result for details</Text>
            )}
            {selected.map((s) => (
              <ListItem key={s.id}>
                <Box
                  display="inline-block"
                  cursor="pointer"
                  onClick={() => updateSelected(["remove", s.id])}
                  mr={2}
                  color="gray.500"
                >
                  <UiX />
                </Box>
                <AutocompleteResultDetails
                  token={tokensById[s.eventId]}
                  resultId={s.id}
                  resultType={s.type}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    </Box>
  );
}
