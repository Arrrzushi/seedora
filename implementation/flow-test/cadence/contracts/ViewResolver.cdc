access(all) contract ViewResolver {

    /// Resolver is a public interface that provides a standard way to get
    /// metadata views for an object.
    ///
    access(all) resource interface Resolver {
        access(all) view fun resolveView(_ Type: Type): AnyStruct?
        access(all) view fun getViews(): [Type]
    }

    /// ResolverCollection is a public interface that provides a standard way to get
    /// metadata views for a collection of objects.
    ///
    access(all) resource interface ResolverCollection {
        access(all) view fun borrowViewResolver(id: UInt64): &{Resolver}
        access(all) view fun getIDs(): [UInt64]
    }
} 