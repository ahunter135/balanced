# Repository Guide
I'm writing this for fun because I think documenting the reasoning/logic behind the repository system I built will help us.

## Goals of this Abstraction Level
I wanted to create a clean interface for interacting with each collection/subcollection to reduce duplicate code and add a layer of abstraction to make interacting with the database an easy/uniform process. Adding custom types to queries, get calls, and other db actions make coding much easier in my opinion. These repositories can clean up the db interface, perform actions on the data before it is returned to the user (like converting a date string to a date object), and cast data to custom types.

## Design Overview
The overall design focuses on two main classes that repositories inherit/use: CollectionRepository and SubcollectionRepository. They each have the same methods
  1. get()
  2. getAll()
  3. getByQuery()
  4. add()
  5. update()
  6. delete()
Each class's methods perform the same action, but they differ in their parameters. Subcollections require more context than collections because they can be n levels deep in a parent collection. Because of this, the SubcollectionRepository class's methods take an extra argument, the reference to the collection. This changes with each call because, for example, one call may edit a doc in /users/123/categories while another edits in /users/321/categories. Each subcollection repository implementation is repsponsible for implementing a custom interface that takes this into account. For a great example, refer to the differences between UserRepositoryService (a collection based repository), CategoryRepositoryService (a subcollection of users), and SubcategoryRepositoryService (a subcollection of categories).

## Creating a New Repository Class
This is very simple, but the instructions differ slightly for collections and subcollections.

### Collections
Simply create a new service and extend CollectionRepository where the generic argument is the type of the collection. Simply pass the collection name into super() in the repositories constructor, and it is all set up!

### Subcollections
Create a new service that extends SubcollectionRepository and implement ISubcollectionRepository (not completely necessary but helps guide). Implement the methods listed in ***Design Overview*** where the parameters are a map to build the collection. This simply means the parameters should be the ids of the parent docs and other args necessary (DocumentData for adding a doc). Build the collection with a private method or collection() and pass that into the parent's corresponding method along with the other arguments. Look at how CategoryRepositoryService and SubCategoryRepositoryService do this for an example.

## Queries
Each repository has a method getByQuery(query: Query). This will likely be the most used method and is the most generic. My plan for this is to define common queries as constants somewhere in the code and they can simply be passed in by the caller. This would help elimate implementing custom query methods that could crowd the interface and allows for the decoupling of the query itself and the object calling the query. Another option for dynamic queries(probably most common case) is building custom classes/functions that help build the queries at runtime.
