# Feature flag

## Running Locally

Requirements:
- docker
- docker-compose
- postgres client

```sh
nvm use
npm install
docker-compose up
```

## Endpoints

### Create MPI with associated identifiers

#### Request

- endpoint: `POST /api/v1/identifiers`
- body:
```js
{ 
  identifiers: [ CreatableIdentifier ]
}
```

#### Responses

- Conflict
  - description: When any of the identifiers are already associated to an MPI
  - status: `409`
  - body:
  ```js
  {
    statusCode: 409,
    error: 'ID_CONFLICT',
    message: 'Identifiers are already associated to a patient'
  }
  ```
- Ok
  - description: MPI with Identifiers created succesfully
  - status: `200`
  - body:
  ```js
  {
    mpi: UUID.V4
  }
  ```

#### Schemas

- CreatableIdentifier:
  ```js
  {
    type: CreatableIdentifierType,
    value: STRING,
    assigner: STRING,
    system: STRING | URI,
    period_start: DATETIME?,
    period_end: DATETIME?
  }
  ```
- CreatableIdentifierType:
  ```js
  FEDERAL_TAX_ID              // "CPF"
  | GENERAL_REGISTRY          // "RG"
  | PASSPORT                  // Passport Number
  | REGIONAL_MEDICAL_COUNCIL  // "CRM"
  | REGIONAL_NURSING_COUNCIL  // "COREN"
  ```
- State:
  ```js 
  AC | AL | AP | AM | BA | CE | DF | ES | GO | MA | MT | MS | MG | PA | PB | PR | PE | PI | RJ | RN | RS | RO | RR | SC | SP | SE | TO
  ```

####  Restrictions

- When the `Identifier.type` is `GENERAL_REGISTRY | REGIONAL_MEDICAL_COUNCIL | REGIONAL_NURSING_COUNCIL` the assigner must be a `State`

### Search Identifier

#### Request

- endpoint: `GET /api/v1/identifiers?type=SearchType&value=STRING`
- query parameters:
```js
{
  type: SearchType,
  value: STRING
}
```
- body: `null`

#### Response

- Empty result
  - status: `204`
  - body: `null`

- Ok
  - status: `200`
  - body:
  ```js
  Identifier
  ```

#### Schemas

- Identifier
  ```js
  {
    type: SearchType,
    value: STRING,
    assigner: STRING,
    system: STRING | URI,
    person_mpi: UUID.V4,
    period_start: DATETIME,
    period_end: DATETIME
  }
  ```
- SearchType:
  ```js
  FEDERAL_TAX_ID
  ```

### List an MPI's Identifiers

#### Request

- endpoint: `GET /api/v1/identifiers/:mpi`
- path parameters:
```js
{
  mpi: UUID.V4
}
```
- body: `null`

#### Responses

- MPI not found
  - status: `404`
  - body:
  ```js
  {
    statusCode: 404,
    error: 'NOT_FOUND',
    message: 'Resource not found',
  }
  ```
- Ok
  - status: `200`
  - body:
  ```js
  {
    result: [ Identifier ]
  }
  ```

#### Schemas

- Identifier:
  ```js
  {
    person_mpi: UUID.V4,
    type: Type,
    assigner: STRING,
    system: STRING | URI,
    period_start: DATETIME,
    period_end: DATETIME
  }
  ```
- Type:
  ```js
  FEDERAL_TAX_ID
  | GENERAL_REGISTRY
  | PASSPORT
  | REGIONAL_MEDICAL_COUNCIL
  | REGIONAL_NURSING_COUNCIL
  | <STRING>
  ```

### Add Identifiers to an MPI

#### Request

- endpoint: `PUT /api/v1/identifiers/:mpi`
- path params:
```js
{
  mpi: UUID.V4
}
```
- body: 
```js
{
  identifiers: [ Identifier ]
}
```

#### Responses

- MPI not found
  - status: `404`
  - body:
  ```js
  {
    statusCode: 404,
    error: 'NOT_FOUND',
    message: 'Resource not found'
  }
  ```
- OK
  - status: `204`
  - body: `null`

#### Schemas

- Identifier:
  ```js
  {
    type: Type,
    value: STRING,
    assigner: STRING,
    system: STRING | URI,
    period_start: DATETIME?,
    period_end: DATETIME?
  }
  ```
- Type:
  ```js
  FEDERAL_TAX_ID
  | GENERAL_REGISTRY
  | PASSPORT
  | REGIONAL_MEDICAL_COUNCIL
  | REGIONAL_NURSING_COUNCIL
  | <STRING>
  ```

#### Restrictions

- Unlike the _Create MPI with associated identifiers_ this endpoint does not raise 
conflict errors when identifiers are already registered for the give MPI
- They will be deduplicated and appended to the MPI
- Has the same Assigner and Type restrictions as the _Create MPI with associated identifiers_ endpoint 
- When `Type` is any `<STRING>` value, the assigner must be a **non-empty `STRING`**


