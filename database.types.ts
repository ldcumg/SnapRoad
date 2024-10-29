export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comment: {
        Row: {
          comment_desc: string | null
          comment_id: string
          created_at: string
          deleted_at: string | null
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment_desc?: string | null
          comment_id?: string
          created_at?: string
          deleted_at?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment_desc?: string | null
          comment_id?: string
          created_at?: string
          deleted_at?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      group: {
        Row: {
          created_at: string
          deleted_at: string | null
          group_desc: string | null
          group_id: string
          group_image_url: string | null
          group_invite_code: string | null
          group_status: string | null
          group_title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          group_desc?: string | null
          group_id?: string
          group_image_url?: string | null
          group_invite_code?: string | null
          group_status?: string | null
          group_title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          group_desc?: string | null
          group_id?: string
          group_image_url?: string | null
          group_invite_code?: string | null
          group_status?: string | null
          group_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          is_cover: boolean
          origin_created_at: string
          post_id: string | null
          post_image_name: string
          post_image_url: string
          post_lat: string | null
          post_lng: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          is_cover?: boolean
          origin_created_at?: string
          post_id?: string | null
          post_image_name?: string
          post_image_url?: string
          post_lat?: string | null
          post_lng?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          is_cover?: boolean
          origin_created_at?: string
          post_id?: string | null
          post_image_name?: string
          post_image_url?: string
          post_lat?: string | null
          post_lng?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      images_test: {
        Row: {
          created_at: string
          id: number
          is_cover: boolean
          post_id: string | null
          post_image_name: string
          post_image_url: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_cover?: boolean
          post_id?: string | null
          post_image_name?: string
          post_image_url?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_cover?: boolean
          post_id?: string | null
          post_image_name?: string
          post_image_url?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "images_test_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string
          deleted_at: string | null
          group_id: string | null
          post_address: string | null
          post_desc: string | null
          post_id: string
          post_lat: string | null
          post_lng: string | null
          post_thumbnail_image: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          group_id?: string | null
          post_address?: string | null
          post_desc?: string | null
          post_id?: string
          post_lat?: string | null
          post_lng?: string | null
          post_thumbnail_image?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          group_id?: string | null
          post_address?: string | null
          post_desc?: string | null
          post_id?: string
          post_lat?: string | null
          post_lng?: string | null
          post_thumbnail_image?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "post_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          deleted_at: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string
          user_image_url: string | null
          user_nickname: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string
          user_image_url?: string | null
          user_nickname?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string
          user_image_url?: string | null
          user_nickname?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          group_id: string | null
          post_id: string
          tag_id: string
          tag_title: string | null
        }
        Insert: {
          group_id?: string | null
          post_id?: string
          tag_id?: string
          tag_title?: string | null
        }
        Update: {
          group_id?: string | null
          post_id?: string
          tag_id?: string
          tag_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      user_group: {
        Row: {
          group_id: string | null
          id: number
          is_owner: boolean | null
          joined_at: string
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: number
          is_owner?: boolean | null
          joined_at?: string
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: number
          is_owner?: boolean | null
          joined_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_group_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "user_group_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_membership: {
        Args: {
          input_invite_code: string
          input_user_id: string
        }
        Returns: {
          returned_group_id: string
          is_member: boolean
        }[]
      }
      get_group_id_by_user: {
        Args: {
          insert_user_id: string
        }
        Returns: string
      }
      get_group_thumbnail_by_group_id: {
        Args: {
          input_group_id: string
        }
        Returns: string
      }
      get_user_groups_with_count: {
        Args: {
          input_user_id: string
          page: number
        }
        Returns: {
          group_id: string
          group_title: string
          group_desc: string
          group_image_url: string
          updated_at: string
          user_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
