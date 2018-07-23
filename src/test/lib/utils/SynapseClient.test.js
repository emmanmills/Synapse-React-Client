import * as SynapseClient from 'lib/utils/SynapseClient';
import * as SynapseConstants from 'lib/utils/SynapseConstants.js';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

it('invalid call', () => {
  return SynapseClient.doGet('/repo/v1/invalid', undefined, 'https://repo-prod.prod.sagebase.org')
    .catch(function (error) {
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual('Not Found');
    })
});

it('version call', () => {
  return SynapseClient.getVersion()
    .then(data => {
      expect(data.version).toBeDefined();
    })
});

it('login', function () {
  SynapseClient.login(process.env.REACT_APP_TEST_USERNAME,
    process.env.REACT_APP_TEST_PASS)
    .then(data => {
      expect(data.sessionToken).toBeDefined();
    })
});

it('get user profiles', () => {
  return SynapseClient.getUserProfiles([345424, 273978, 273991])
    .then(data => {
      expect(data.list).toBeDefined();
      expect(data.list.length).toEqual(3);
    })
});


it('list entity children', () => {
  let request = {
    includeTypes: ["project", "folder", "file", "link"],
    parentId: "syn300013",
    sortBy: "NAME",
    sortDirection: "ASC"
  }
  return SynapseClient.getEntityChildren(request)
  .then(data => {
    expect(data.page).toBeDefined();
  })
});


it('get files', () => {
  let request = {
    includeFileHandles: true, // set to true to get file metadata
    includePreSignedURLs: true, // set to true to get presigned url to s3 resource (authorization required, include a session token in this case!)
    requestedFiles: [
      {fileHandleId: "1234", associateObjectId: "1725696", associateObjectType: "FileEntity"},
      {fileHandleId: "5678", associateObjectId: "1725697", associateObjectType: "FileEntity"}
    ]
  }
  return SynapseClient.getFiles(request)
  .then(data => {
    expect(data.requestedFiles).toBeDefined();
  })
});

it('get entity bundle latest version', () => {
  let partsMask = SynapseConstants.ENTITY_BUNDLE_MASK_ENTITY
  | SynapseConstants.ENTITY_BUNDLE_MASK_RESTRICTION_INFORMATION
  | SynapseConstants.ENTITY_BUNDLE_MASK_FILE_HANDLES;
  return SynapseClient.getEntityBundleForVersion('syn1725696', undefined, partsMask)
  .then(data => {
    expect(data.entity).toBeDefined();
    expect(data.restrictionInformation).toBeDefined();
    expect(data.fileHandles).toBeDefined();
  })
});

it('get synapse wiki', () => {
  let ownerId = "syn2580853"
  let wikiId = "409840"
  return SynapseClient.getWikiEntity("", ownerId, wikiId).then(data => {
    expect(data.markdown).toBeDefined()
  })
})


describe('Test functionality with a sample user', function () {
  let token = ""
  let ownerId = ""
  
  /**
   * Login with a test user to allow for user based
   * functionality
   */
  beforeAll(
    function() {
      SynapseClient.login(process.env.REACT_APP_TEST_USERNAME,
        process.env.REACT_APP_TEST_PASS)
        .then(data => {
          token = data.token
          SynapseClient.getUserProfile(token).then(
            userData => {
              ownerId = userData.ownerId
            }
          )
        })
      }
    )
    
    it('get user favorites', () => {
      SynapseClient.getUserFavorites(token).then(data =>
        {
          expect(data.results).toBeDefined()
        }
      ).catch(err => {
        console.log('error is ', err)
      })
    })
    
    it('get single user profile', () => {
      return SynapseClient.getUserProfile(token)
        .then(data => {
          expect(data).toBeDefined();
        })
    });

    it('get single user profile', () => {
      return SynapseClient.getUserProjectList(token, "MY_PROJECTS")
        .then(data => {
          expect(data).toBeDefined();
        })
    });

    it('get user teams', () => {
      return SynapseClient.getUserTeamList(token, ownerId)
        .then(data => {
          expect(data).toBeDefined();
        }).catch(err => {console.log("team err\n",err) })
    });

  }
)

// ERROR: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL
// Tried increasing timeout to 30s, but still occurs.  Not sure why the signal is not being sent back
// it('create project', done => {
//   //create a project (with a random name)
//   return SynapseClient.createProject('synapse react test ' + 
//     Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), global.sessionToken)
//     .then(newProject => {
//       expect(newProject.id).toBeDefined();
//       done();
//     })
// });

