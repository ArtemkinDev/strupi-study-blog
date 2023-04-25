import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Alert,
  Box,
  BaseCheckbox,
  Typography,
  VisuallyHidden,
  Loader,
  Link,
  Flex,
  IconButton,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/helper-plugin';
import { Pencil, Trash, Plus } from '@strapi/icons';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';

const Repo = () => {
  const COL_COUNT = 10;
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkedRepos, setCheckedRepos] = useState([]);
  const [alert, setAlert] = useState(null);

  const allReposChecked = repos.length === checkedRepos.length;
  const isIndeterminate = checkedRepos.length > 0 && !allReposChecked;

  const client = useFetchClient();

  const { formatMessage } = useIntl();

  useEffect(() => {
    setLoading(true);

    client
      .get('/github-projects/repos')
      .then((result) => {
        setRepos(result.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const checkAllToggler = () => {
    if (allReposChecked) return setCheckedRepos([]);

    setCheckedRepos(repos.map((r) => r.id));
  };

  const checkRepo = (id) => {
    let checkedReposNew = [];

    if (checkedRepos.includes(id)) {
      checkedReposNew = checkedRepos.filter((repoId) => repoId !== id);
    } else checkedReposNew = [...checkedRepos, id];

    setCheckedRepos(checkedReposNew);
  };

  const createProject = async (repo) => {
    const response = await client.post('/github-projects/project', repo);
    if (response && response.data) {
      setRepos(
        repos.map((r) =>
          +r.id !== +repo.id
            ? r
            : {
                ...r,
                projectId: response.data.id,
              },
        ),
      );

      showAlert({
        title: `Project created!`,
        variant: 'success',
        text: `Project ${response.data.title} was created!`,
      });
    } else {
      showAlert({
        title: `Error!`,
        variant: 'danger',
        text: `Error ${response.data.title}!`,
      });
    }
  };

  const showAlert = (alert) => {
    setAlert(alert);

    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  if (loading) {
    return (
      <Box padding={8} background="neutral100">
        <Loader>Loading content...</Loader>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={8} background="neutral100">
        <Alert closeLabel="Close alert" title="Fetch error" variant="danger">
          {error ? error.toString() : ''}
        </Alert>
      </Box>
    );
  }

  return (
    <Box padding={8} background="neutral100">
      {alert && (
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50% , 0)' }}>
          <Alert closeLabel="Close alert" title={alert.title} variant={alert.variant}>
            {alert.text}
          </Alert>
        </div>
      )}
      <Table colCount={COL_COUNT} rowCount={repos.length}>
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox
                onValueChange={checkAllToggler}
                indeterminate={isIndeterminate}
                value={allReposChecked}
                aria-label="Select all entries"
              />
            </Th>
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad('repo.name'),
                  defaultMessage: 'Name',
                })}
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad('repo.description'),
                  defaultMessage: 'Description',
                })}
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad('repo.url'),
                  defaultMessage: 'url',
                })}
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad('repo.actions'),
                  defaultMessage: 'Actions',
                })}
              </Typography>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {repos.map((repo) => {
            const { id, name, url, shortDescription, projectId } = repo;

            return (
              <Tr key={id}>
                <Td>
                  <BaseCheckbox
                    value={checkedRepos && checkedRepos.includes(id)}
                    onValueChange={() => checkRepo(id)}
                    aria-label={`Select ${id}`}
                  />
                </Td>
                <Td>
                  <Typography textColor="neutral800">{name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{shortDescription ? shortDescription : '-'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    <Link href={url} isExternal>
                      {url}
                    </Link>
                  </Typography>
                </Td>
                <Td>
                  {projectId ? (
                    <Flex>
                      <Link to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}`}>
                        <IconButton label="Edit" noBorder icon={<Pencil />} />
                      </Link>
                      <Box paddingLeft={1}>
                        <IconButton onClick={() => console.log('delete')} label="Delete" noBorder icon={<Trash />} />
                      </Box>
                    </Flex>
                  ) : (
                    <IconButton onClick={() => createProject(repo)} label="Create project" noBorder icon={<Plus />} />
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Repo;
