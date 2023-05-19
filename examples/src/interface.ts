/**
 *
 * @author Quia (zehua.tang)
 * @since 2023-03-31 16:52
 */

export interface INavigation {
  push: (key: any, params?: Record<string, any>) => void;
}

export interface RefLinkModal {
  setModalVisible: (visile: boolean) => void;
}
